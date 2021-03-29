from .util import get_key_by_val, index_dict, modes_to_int, mode_aliases

from django.test import LiveServerTestCase
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.chrome.options import Options
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
    cls.end_table = cls.selenium.find_element_by_id('table-container')
    cls.navs = cls.selenium.find_elements_by_class_name('nav-link')


  @classmethod
  def tearDownClass(cls):
    cls.selenium.quit()
    super().tearDownClass()
  
  def test_0(self):
    ''' Check if creating a poll works '''
    selenium = self.selenium
    
    # Check if the correct sections are hidden and shown
    self.assertFalse('visually-hidden' in self.choose_comps.get_attribute('class'))
    self.assertTrue('visually-hidden' in self.poll.get_attribute('class'))
    self.assertTrue('visually-hidden' in self.end_table.get_attribute('class'))

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

    sleep(0.2)

    self.assertEqual(comp_1.text, 'si')
    self.assertEqual(comp_2.text, 'no')

    # Check if the correct sections are hidden and shown
    self.assertTrue('visually-hidden' in self.choose_comps.get_attribute('class'))
    self.assertFalse('visually-hidden' in self.poll.get_attribute('class'))
    self.assertTrue('visually-hidden' in self.end_table.get_attribute('class'))

  def test_1(self):
    ''' Check if modes pages are shown properly '''
    next_btn = self.selenium.find_element_by_id('next')

    for i in range(6):
      self.check_inputs(next_btn, i)
    
  def test_2(self):
    ''' Check if going back through modes works '''
    prev_btn = self.selenium.find_element_by_id('previous')    
    
    for i in reversed(range(7)):
      self.check_inputs(prev_btn, i, True)

  def test_3(self):
    ''' Check if the end table works '''
    # Go to the end table
    self.navs[7].click()

    sleep(0.1)

    # Check if the correct sections are shown
    self.assertTrue('visually-hidden' in self.choose_comps.get_attribute('class'))
    self.assertTrue('visually-hidden' in self.poll.get_attribute('class'))
    self.assertFalse('visually-hidden' in self.end_table.get_attribute('class'))

    rows = [self.selenium.find_elements_by_class_name('comp-1-table'), self.selenium.find_elements_by_class_name('comp-2-table')]

    for i in range(2):
      for j in range(len(rows[i])):
        if i == 0:
          # First row
          if j == 0:
            # First row, first col is comp_1
            self.assertEqual(rows[i][j].text, 'si')
            return
            
        else:
          # Second row
          if j == 0:
            # Second row, first col is comp_2
            self.assertEqual(rows[i][j].text, 'no')
            return

        # They all should be equal to 0
        self.assertEqual(rows[i][j].text, 0)
    
    self.assertEqual(self.selenium.find_element_by_id('winner').text, 'Réplica')

  def check_inputs(self, btn, i, reverse = False):
    ''' Checks if the mode pages are shown properly '''
    # Check the navbar
    self.assertFalse('disabled' in self.navs[i].get_attribute('class'))
    self.assertTrue('active' in self.navs[i].get_attribute('class'))

    mode = self.selenium.find_element_by_id('mode')
    
    # Check if the mode is ok
    self.assertEqual(mode.get_attribute('data-current_mode'), get_key_by_val(modes_to_int, i))
    self.assertEqual(mode.text, index_dict(mode_aliases, i))

    # Check for the length of the inputs
    inputs = self.selenium.find_elements_by_class_name('input')
    
    if mode.get_attribute('data-current_mode') == 'tematicas':
      self.assertEqual(len(inputs), 7 * 2)
    elif mode.get_attribute('data-current_mode') == 'deluxe':
      self.assertEqual(len(inputs), 14 * 2)
    else:
      self.assertEqual(len(inputs), 9 * 2)

    if i == 6:
      self.assertEqual(self.selenium.find_element_by_id('next').get_attribute('value'), 'Terminar')

    if reverse:
      if i != 0:
        btn.click()
        sleep(0.5)
      return

    btn.click()
    sleep(0.5)