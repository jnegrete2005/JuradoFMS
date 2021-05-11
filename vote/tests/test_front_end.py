from .util import get_key_by_val, index_dict, modes_to_int, mode_aliases
from time import sleep
from typing import List

from django.test import LiveServerTestCase

from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webelement import WebElement

class FrontEndTestCase(LiveServerTestCase):
  @classmethod
  def setUpClass(cls):
    super().setUpClass()
    cls.selenium = WebDriver()
    cls.selenium.implicitly_wait(10)

    # Get the URL
    cls.selenium.get('http://127.0.0.1:8000/vota/')

    # Add CSRFToken 
    cls.selenium.add_cookie({'name': 'csrftoken', 'value': '1cY4Yb3SljOqj9tUndW1YlIokNOD8tNc2MSU5iKNvsZW8co9WoOOCVGd5RFzxD8P'})

    # Define page sections
    cls.choose_comps = cls.selenium.find_element_by_id('choose-comps')
    cls.poll = cls.selenium.find_element_by_id('poll-container')
    cls.end_table = cls.selenium.find_element_by_id('end-container')
    cls.navs = cls.selenium.find_elements_by_class_name('nav-link')


  @classmethod
  def tearDownClass(cls):
    cls.selenium.quit()
    super().tearDownClass()
  
  def test_0(self):
    ''' Check if creating a poll works '''
    selenium = self.selenium
    
    # Check if the correct sections are hidden and shown
    self.assertFalse('d-none' in self.choose_comps.get_attribute('class'))
    self.assertTrue('d-none' in self.poll.get_attribute('class'))
    self.assertTrue('d-none' in self.end_table.get_attribute('class'))

    # Get and check the nav items
    for nav in self.navs:
      self.assertTrue('disabled' in nav.get_attribute('class'))

    # Get the submit btn
    submit = selenium.find_element_by_id('submit-comps')

    # Get and populate the comps
    comp_1 = selenium.find_element_by_id('comp-1-input')
    comp_2 = selenium.find_element_by_id('comp-2-input')

    self.make_invalid_comps(comp_1, comp_2, submit)

    comp_1.send_keys('si')
    comp_2.send_keys('no')

    # Submit and wait
    submit.click()

    # Get and check the comps
    comp_1 = selenium.find_element_by_id('comp-1')
    comp_2 = selenium.find_element_by_id('comp-2')

    sleep(2)

    self.assertEqual(comp_1.text, 'si')
    self.assertEqual(comp_2.text, 'no')

    # Check if the correct sections are hidden and shown
    self.assertTrue('d-none' in self.choose_comps.get_attribute('class'))
    self.assertFalse('d-none' in self.poll.get_attribute('class'))
    self.assertTrue('d-none' in self.end_table.get_attribute('class'))

  def test_1(self):
    ''' Check if modes pages are shown properly '''
    next_btn = self.selenium.find_element_by_id('next')

    for i in range(7):
      self.check_mode(next_btn, i)
    
  def test_2(self):
    ''' Check if going back through modes works '''
    prev_btn = self.selenium.find_element_by_id('previous')    
    
    for i in reversed(range(8)):
      self.check_mode(prev_btn, i, True)

    self.check_input_vals()

  def test_3(self):
    ''' Check if the end table works '''
    # Go to the end table
    self.navs[8].click()

    sleep(1)

    # Check if the correct sections are shown
    self.assertTrue('d-none' in self.choose_comps.get_attribute('class'))
    self.assertTrue('d-none' in self.poll.get_attribute('class'))
    self.assertFalse('d-none' in self.end_table.get_attribute('class'))

    rows = [self.selenium.find_elements_by_class_name('comp-1-table'), self.selenium.find_elements_by_class_name('comp-2-table')]

    for i in range(2):
      for j in range(len(rows[i])):
        if i == 0 and j == 0:
          # First row, first col is comp_1
          self.assertEqual(rows[i][j].text, 'si')
          continue

        elif i == 1 and j == 0:
          # Second row, first col is comp_2
          self.assertEqual(rows[i][j].text, 'no')
          continue

        # They all should be equal to 0
        self.assertEqual(rows[i][j].text, '0')

    
    self.assertEqual(self.selenium.find_element_by_id('winner').text, 'Réplica')
  
  def test_4(self):
    ''' Will check if the table shows comp_1 as winner '''
    # Give 8 points to comp_1
    self.add_points(1, 2)

    # Check if the table has the correct info
    self.check_table('comp-1-table', 8, 'si')

  def test_5(self):
    ''' Will check if the table shows comp_2 as winner '''
    # Give 16 points to comp_2
    self.add_points(2, 2)

    # Check if the table has the correct info
    self.check_table('comp-2-table', 8, 'no')

  def test_6(self):
    ''' Checks if replica #1 works in all aspects '''
    # Give comp_1 enough points to be a replica
    self.add_points(replica=True)

    self.check_table('comp-1-table', 0, 'Réplica')

    # Click replica btn
    self.selenium.find_element_by_id('end-btn').click()

    # Check the page without going to the next mode
    self.check_mode(None, 9, False, False)

    # Make comp_1 win
    self.check_rep_winner('si', 8, 0)

    # Make comp_2 win
    self.check_rep_winner('no', 0, 8)

    # Make first replica
    self.check_rep_winner(winner='Réplica', replica=True)

  def test_7(self):
    ''' Checks if replica #2 works in all aspects '''
    sleep(0.5)

    # Click replica btn
    self.selenium.find_element_by_id('rep-btn').click()

    # Check the page without going to the next mode
    self.check_mode(None, 9, False, False)

    # Make comp_1 win
    self.check_rep_winner('si', 8, 0)

    # Make comp_2 win
    self.check_rep_winner('no', 0, 8)

    # Make second replica
    self.check_rep_winner(winner='Réplica', replica=True, rep_counter=1)
    
    # End the poll
    self.selenium.find_elements_by_class_name('choice-input')[0].click()
    self.selenium.find_element_by_id('rep-btn').click()

    sleep(0.1)

    self.assertTrue(self.selenium.current_url, 'http://127.0.0.1:8000/vota/')


  def check_rep_winner(self, winner: str, comp_1_total = 0, comp_2_total = 0, replica = False, rep_counter = 0):
    '''
    Will make a winner and check it in the rep table
    `comp_num_total` will be divided by 4 to `add_points`
    to each of the competitors. Then, it will go to the
    table. Finally, it will check each of the cells using the
    data given.
    '''
    # Add the points to the comps
    if replica:
      self.add_points(deluxe=False ,replica=True)
    else:
      self.add_points(1, int(comp_1_total / 4), False)
      self.add_points(2, int(comp_2_total / 4), False)

    # Check the values of the table
    comps = ['si', 'no']
    for i in range(2):
      inputs = list(map(lambda comp_el : comp_el.text, self.selenium.find_elements_by_class_name(f'comp-{i + 1}-rep')))

      if i == 0:
        self.assertEqual(inputs[0], comps[i])
        self.assertEqual(inputs[1], str(comp_1_total))      
        continue

      self.assertEqual(inputs[0], comps[i])
      self.assertEqual(inputs[1], str(comp_2_total))

    # Check the winner in the table
    self.assertEqual(self.selenium.find_element_by_id('rep-winner').text, winner)

    # Second replica case
    if rep_counter == 1:
      # Make sure the boxes are shown
      self.assertIn('d-flex', self.selenium.find_element_by_id('choices-form').get_attribute('class'))
      self.assertNotIn('d-none', self.selenium.find_element_by_id('choices-form').get_attribute('class'))

      # Check the content of the boxes
      inputs = list(map(lambda el : el.text, self.selenium.find_elements_by_class_name('choice-input')))
      for i in range(2):
        self.assertEqual(inputs[i], comps[i])

      # Check the btn value
      self.assertEqual(self.selenium.find_element_by_id('rep-btn').text, 'Terminar')
      return 

    # Check btns
    if winner == 'Réplica':
      self.assertEqual(self.selenium.find_element_by_id('rep-btn').text, 'Réplica')
    else:
      self.assertEqual(self.selenium.find_element_by_id('rep-btn').text, 'Terminar')
      return

  def check_mode(self, btn, i, reverse = False, check_next = True):
    '''
    Checks if the mode page is shown properly
    by checking the navbar, the mode el and its
    innerText, length of the inputs, and then,
    goes to the next mode by clicking the `btn`
    that was passed.
    '''
    # Check the navbar
    self.assertFalse('disabled' in self.navs[i].get_attribute('class'))
    self.assertTrue('active' in self.navs[i].get_attribute('class'))

    mode = self.selenium.find_element_by_id('mode')
    current_mode = mode.get_attribute('data-current_mode')

    sleep(0.5)
    
    # Check if the mode is ok
    self.assertEqual(current_mode, get_key_by_val(modes_to_int, i))
    self.assertEqual(mode.text, index_dict(mode_aliases, i))

    # Check for the length of the inputs
    inputs = self.selenium.find_elements_by_class_name('input')

    if (current_mode == 'tematicas_1' or 
        current_mode == 'tematicas_2'):
      self.assertEqual(len(inputs), 7 * 2)
    elif current_mode == 'random_score':
      self.assertEqual(len(inputs), 11 * 2)
      self.check_tabindex(current_mode)
    elif current_mode == 'deluxe':
      self.assertEqual(len(inputs), 14 * 2)
      self.check_tabindex(current_mode)
    elif current_mode == 'replica':
      self.check_tabindex(current_mode)
    else:
      self.assertEqual(len(inputs), 9 * 2)

    if i == 7 or i == 9:
      self.assertEqual(self.selenium.find_element_by_id('next').get_attribute('value'), 'Terminar')
    elif i % 2 == 0:
      self.assertEqual(self.selenium.find_element_by_class_name('comp-container').text, 'si')
    else:
      self.assertEqual(self.selenium.find_element_by_class_name('comp-container').text, 'no')

    if not check_next:
      return sleep(0.5)

    if reverse:
      if i != 0:
        btn.click()
        sleep(0.5)
      return

    btn.click()
    sleep(0.5)

  def add_points(self, comp_num: int = None, num: int = 4, deluxe = True, replica = False):
    ''' Will add `num` * 4 points to the competitor you specify by `table` '''
    if deluxe:
      self.navs[7].click()
    else:
      self.navs[9].click()

    sleep(1)

    if replica:
      inputs = [self.selenium.find_elements_by_class_name('comp-1-input'), self.selenium.find_elements_by_class_name(f'comp-2-input')]
      for i in range(4):
        inputs[0][i].clear()
        inputs[1][i].clear()
      self.selenium.find_element_by_id('next').click()
      return sleep(1)

    other_comp = { 1: 2, 2: 1 }

    # Give the points to the competitor and got the table
    inputs = [self.selenium.find_elements_by_class_name(f'comp-{comp_num}-input'), self.selenium.find_elements_by_class_name(f'comp-{other_comp[comp_num]}-input')]
    for i in range(num):
      inputs[0][i].send_keys(4)
      inputs[1][i].clear()
    self.selenium.find_element_by_id('next').click()

    sleep(1)

  def check_table(self, row: str, num: int, win: str):
    ''' 
    Will check if the last cels of the row of the table you give it with `row` 
    is equal to `num`.
    
    Will also check if the winner row is equal to `win`
    '''
    # Check deluxe and total in table
    table = self.selenium.find_elements_by_class_name(row)
    for i in 8, 9:
      self.assertEqual(table[i].text, str(num))

    # Check winner
    self.assertEqual(self.selenium.find_element_by_id('winner').text, win)

    # Check btns
    self.assertEqual(self.selenium.find_element_by_id('prev-end-btn').text, 'Deluxe')
    if win == 'Réplica':
      self.assertEqual(self.selenium.find_element_by_id('end-btn').text, 'Avanzar a réplica')
    else:
      self.assertEqual(self.selenium.find_element_by_id('end-btn').text, 'Terminar')

  def check_tabindex(self, mode: str):
    inputs = [
      self.selenium.find_elements_by_class_name('comp-1-input'), 
      self.selenium.find_elements_by_class_name('comp-2-input')
    ]

    tabindex = {
      'random_score': [
        [1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 19],
        [3, 4, 7, 8, 11, 12, 15, 16, 20, 21, 22],
      ],
      'deluxe': [
        [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24, 25],
        [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 26, 27, 28],
      ],
      'replica': [
        [1, 3, 5, 7, 9, 11, 13, 14, 15],
        [2, 4, 6, 8, 10, 12, 16, 17, 18],
      ],
    }

    for i in range(2):
      for j in range(len(inputs[i])):
        if (tabindex[mode][i][j] != int(inputs[i][j].get_attribute('tabindex'))):
          return False
        continue

  def check_input_vals(self):
    inputs: List[List[WebElement]] = [
      self.selenium.find_elements_by_class_name('comp-1-input'),
      self.selenium.find_elements_by_class_name('comp-2-input')  
    ]

    keys = [Keys.SPACE, '.']

    for i in 0, 1:
      # Use the comp-1-input to check with space bar
      # and the comp-2-input to check with '.'
      for j in range(6):
        current = inputs[i][j]

        if j == 0:
          current.send_keys(keys[i])
          self.assertEqual(current.get_attribute('value'), '0.5')
          current.send_keys(Keys.BACKSPACE)
          continue
        
        current.send_keys(str(j - 1))
        self.assertEqual(current.get_attribute('value'), str(j - 1))

        if j != 5:
          current.send_keys(keys[i])
          self.assertEqual(current.get_attribute('value'), f'{j - 1}.5')
          current.send_keys(Keys.BACKSPACE)

        current.send_keys(Keys.BACKSPACE)
    
  def make_invalid_comps(self, comp_1: WebElement, comp_2: WebElement, btn: WebElement):
    '''
    This will send invalid comps to the page and check if the page responds correctly.
    There are 3 type of invalid comps:
    1. Empty comp
    2. Lower than 2 chars of length
    3. Higher than 20 chars of length (untestable, browser won't let you put more chars)
    '''

    # Element where the feedback will be held
    feeds: List[WebElement] = self.selenium.find_elements_by_class_name('invalid-feedback')

    comps = [comp_1, comp_2]

    # First scenario (Empty comp)
    btn.click()
    for feed in feeds:
      self.assertEqual(feed.text, 'Por favor, llene el campo para continuar')
    
    # Second scenario (lower than 2 chars)
    for comp in comps:
      comp.send_keys('p')
    btn.click()
    for feed in feeds:
      self.assertEqual(feed.text, 'El competidor tiene que tener entre 2 y 20 caracteres')

    for comp in comps:
      comp.clear()
