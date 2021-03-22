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

    # Define page sections
    cls.choose_comps = cls.selenium.find_element_by_id('choose-comps')
    cls.poll = cls.selenium.find_element_by_id('poll-container')
    cls.end_table = cls.selenium.find_element_by_id('table-container')

    # Get the URL
    cls.selenium.get('http://127.0.0.1:8000/vota/')

    # Add CSRFToken 
    cls.selenium.add_cookie({'name': 'csrftoken', 'value':'1cY4Yb3SljOqj9tUndW1YlIokNOD8tNc2MSU5iKNvsZW8co9WoOOCVGd5RFzxD8P'})

  @classmethod
  def tearDownClass(cls):
    cls.selenium.quit()
    super().tearDownClass()
  
  def test_choose_comps(self):
    selenium = self.selenium
    
    ''' Before the poll submit '''
    choose_comps = selenium.find_element_by_id('choose-comps')

    # Get and check the nav items
    navs = selenium.find_elements_by_class_name('nav-link')

    for nav in navs:
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
    sleep(5)

    ''' After the poll submit '''
    # Get and check the comps
    comp_1 = selenium.find_element_by_id('comp-1')
    comp_2 = selenium.find_element_by_id('comp-2')

    self.assertEqual(comp_1.get_attribute('innerHTML'), 'si')
    self.assertEqual(comp_2.get_attribute('innerHTML'), 'no')

    # Check if the navs don't have disabled (except for replica)
    for i in range(len(navs)):
      if i != len(navs) - 1:
        self.assertFalse('disabled' in navs[i].get_attribute('class'))
      else:
        self.assertTrue('disabled' in navs[i].get_attribute('class'))

    # Check if easy is active
    self.assertTrue('active' in navs[0].get_attribute('class'))
