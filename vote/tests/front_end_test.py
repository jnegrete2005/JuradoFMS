from .util import get_key_by_val, index_dict, modes_to_int, mode_aliases

from django.test import LiveServerTestCase
from selenium.webdriver.chrome.webdriver import WebDriver
from time import sleep

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
    # Click replica btn
    self.selenium.find_element_by_id('rep-btn').click()

    # Check the page without going to the next mode
    self.check_mode(None, 9, False, False)

    # Make comp_1 win
    self.check_rep_winner('si', 8, 0)

    # Make comp_2 win
    self.check_rep_winner('no', 0, 8)

    # Make second replica
    self.check_rep_winner(winner='Réplica', replica=True)


  def check_rep_winner(self, winner: str, comp_1_total = 0, comp_2_total = 0, replica = False):
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

    sleep(0.5)
    
    # Check if the mode is ok
    self.assertEqual(mode.get_attribute('data-current_mode'), get_key_by_val(modes_to_int, i))
    self.assertEqual(mode.text, index_dict(mode_aliases, i))

    # Check for the length of the inputs
    inputs = self.selenium.find_elements_by_class_name('input')
    
    if (mode.get_attribute('data-current_mode') == 'tematicas_1' or 
        mode.get_attribute('data-current_mode') == 'tematicas_2'):
      self.assertEqual(len(inputs), 7 * 2)
    elif mode.get_attribute('data-current_mode') == 'deluxe':
      self.assertEqual(len(inputs), 14 * 2)
    else:
      self.assertEqual(len(inputs), 9 * 2)

    if i == 7 or i == 9:
      self.assertEqual(self.selenium.find_element_by_id('next').get_attribute('value'), 'Terminar')

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
