import logging
from django.test import TestCase
from social.models import Group, Message, InappropiateLanguage
from authentication.models import FlatterUser
import time
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium.webdriver.common.action_chains import ActionChains

logging.disable(logging.CRITICAL)

# Create your tests here.

class SeleniumTestCase(StaticLiveServerTestCase):
    def setUp(self):
        super().setUp()

        options = webdriver.ChromeOptions()
        # options.headless = True
        # crear una instancia de ChromeDriver
        self.browser = webdriver.Chrome(options=options)
        # maximizar la ventana del navegador
        self.browser.maximize_window()
        # esperar implicitamente 5 segundos antes de lanzar excepciones
        self.browser.implicitly_wait(5)

        self.browser.get('http://localhost:3000')

        flatteruser = FlatterUser(username='user_test', password='password_test', email='email@test.com', 
            first_name='first_name_test', last_name='last_name_test', is_active=True, is_staff=False, is_superuser=False, flatter_coins=1000)
        flatteruser.save()

        inquilinoUser = FlatterUser(username='user_test_inquilino', password='password_test', email='inquilinoemail@test.com', 
            first_name='Inquilino', last_name='Prueba', is_active=True, is_staff=False, is_superuser=False, flatter_coins=1000)
        inquilinoUser.save()

        #Registro de usuario propietario
        if not FlatterUser.objects.filter(username='user_test').exists():
            self.browser.find_element(By.XPATH, "//button[contains(.,'Registrarme')]").click()
            self.browser.find_element(By.ID, "first_name").send_keys("first_name_test")
            self.browser.find_element(By.ID, "last_name").send_keys("last_name_test")
            self.browser.find_element(By.ID, "username").send_keys("user_test")
            self.browser.find_element(By.ID, "email").send_keys("email@test.com")
            self.browser.find_element(By.ID, "password").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys(Keys.ENTER)
            time.sleep(3)
            self.browser.get('http://localhost:3000/me')
            self.browser.find_element(By.XPATH, "//button[contains(.,'Cerrar sesión')]").click()
            time.sleep(3)

        #Registro de usuario no propietario
        if not FlatterUser.objects.filter(username='user_test_inquilino').exists():
            self.browser.find_element(By.XPATH, "//button[contains(.,'Registrarme')]").click()
            self.browser.find_element(By.ID, "first_name").send_keys("Inquilino")
            self.browser.find_element(By.ID, "last_name").send_keys("Prueba")
            self.browser.find_element(By.ID, "username").send_keys("user_test_inquilino")
            self.browser.find_element(By.ID, "email").send_keys("inquilinoemail@test.com")
            self.browser.find_element(By.ID, "password").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys(Keys.ENTER)
            time.sleep(3)
            self.browser.get('http://localhost:3000/me')
            self.browser.find_element(By.XPATH, "//button[contains(.,'Cerrar sesión')]").click()
            time.sleep(3)


    def tearDown(self):
        self.browser.quit()

        # Borramos el usuario de prueba
        FlatterUser.objects.get(username='user_test').delete()
        FlatterUser.objects.get(username='user_test_inquilino').delete()

    
    def test_register(self):
       # Los usuarios ya han sido credos en el setUp
       pass

    # Test de login
    def test_login(self):
        self.browser.get('http://localhost:3000')
        time.sleep(3)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()

        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(3)
        # Ir a perfil en la url: http://localhost:3000/me
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.XPATH, "//h4[contains(.,'Cerrar sesión')]").click()
        time.sleep(3)
    

    # Test de edición de perfil	privado
    def test_edit_private_profile(self):
        self.browser.get('http://localhost:3000')
        time.sleep(3)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()

        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(3)
        # Ir a perfil en la url: http://localhost:3000/me
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.ID, "firstName").clear()
        self.browser.find_element(By.ID, "firstName").send_keys("Mrs")
        self.browser.find_element(By.ID, "lastName").clear()
        self.browser.find_element(By.ID, "lastName").send_keys("Propietaria")
        self.browser.find_element(By.ID, "phoneNumber").clear()
        self.browser.find_element(By.ID, "phoneNumber").send_keys("666666666")
        self.browser.find_element(By.ID, "phoneNumber").send_keys(Keys.ENTER)
        time.sleep(5)

        # Comprobamos que se ha editado correctamente
        self.browser.get('http://localhost:3000/me')
        self.assertEqual(self.browser.find_element(By.ID, "firstName").get_attribute('value'), "Mrs")

    
    # Test de edición de perfil	público
    def test_edit_public_profile(self):
        self.browser.get('http://localhost:3000')
        time.sleep(3)

        #Login
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()
        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(2)

        # Ir a perfil en la url: http://localhost:3000/me
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.XPATH, "//h4[contains(.,'Mi perfil público')]").click()
        self.browser.find_element(By.XPATH, "//button[@title='Edita tu perfil']").click()
        time.sleep(3)
        self.browser.find_element(By.ID, "firstName").clear()
        self.browser.find_element(By.ID, "firstName").send_keys("Mrs")
        self.browser.find_element(By.ID, "lastName").clear()
        self.browser.find_element(By.ID, "lastName").send_keys("Propietaria")
        self.browser.find_element(By.ID, "lastName").send_keys(Keys.ENTER)
        time.sleep(5)

        # Comprobamos que se ha editado correctamente
        self.browser.get('http://localhost:3000/me')
        self.assertEqual(self.browser.find_element(By.ID, "firstName").get_attribute('value'), "Mrs")
    

    # Test de chats
    def test_chat(self):
        # Primero nos logueamos con el usuario inquilino
        self.browser.get('http://localhost:3000')
        time.sleep(3)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()
        self.browser.find_element(By.ID, "username").send_keys("user_test_inquilino")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(2)

        # Adquirimos el plan avanzado para crear chats
        ### No funciona la pasarela de pago, así que no se pueden añadir fondos para adquirir el plan avanzado
        ### Se han añadido manualmente los flattercoins necesarios para adquirir el plan avanzado
        
        self.browser.find_element(By.XPATH, "//a[contains(.,'Planes')]").click()
        time.sleep(2)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Activar')]").click()
        time.sleep(2)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Continuar')]").click()
        time.sleep(2)
        self.browser.find_element(By.XPATH, "//div[contains(text(), 'Confirmar')]").click()
        time.sleep(2)

        self.browser.get('http://localhost:3000')
        time.sleep(2)

        # Hacemos click en cualquier punto de la pantalla para cerrar el modal
        '''
        modal = self.browser.find_element(By.CSS_SELECTOR, '.modal-content')
        modal.click()
        elemento_fondo = self.browser.find_element(By.CSS_SELECTOR, '.modal-backdrop')
        posicion_fondo = elemento_fondo.location
        tamano_fondo = elemento_fondo.size
        punto_x = posicion_fondo['x'] + tamano_fondo['width'] + 10 # Suma un pequeño margen para asegurarte de que estás fuera del fondo
        punto_y = posicion_fondo['y'] + tamano_fondo['height'] + 10 # Suma un pequeño margen para asegurarte de que estás fuera del fondo
        ActionChains(driver).move_by_offset(punto_x, punto_y).click().perform()
        '''


        # Buscamos usuarios para chatear
        self.browser.find_element(By.XPATH, "//a[contains(.,'Buscador de usuarios')]").click()
        time.sleep(2)

        # Buscamos la tarjeta en la que se encuentra el primer usuario que aparece en la lista y hacemos click sobre su imagen
        try:
            user_prop = self.browser.find_element(By.XPATH, "//div[@class='user-card']//div[@class='user-card__info']//p[contains(text(), '@user_test')]")
            card_info = user_prop.find_element(By.XPATH, "./..")
            user_card = card_info.find_element(By.XPATH, "./..")
        except:
            user_card = self.browser.find_element(By.XPATH, "//div[@class='user-card']")
            
        img_element = user_card.find_element(By.XPATH, ".//div[@class='user-card__avatar']")
        img_element.click()
        time.sleep(2)

        # Dentro de los detalles del usuario, hacemos click en el botón de chat
        chat_button = self.browser.find_element(By.XPATH, "//button[@title='Contacta con @user_test']")
        chat_button.click()
        time.sleep(2)

        # Escribimos un mensaje en el chat
        chat_input = self.browser.find_element(By.ID, "chatInput")
        chat_input.send_keys("Esto es una prueba de chat")
        time.sleep(2)
        chat_input.send_keys(Keys.ENTER)
        time.sleep(2)

        # Cerramos el chat y cerramos sesión
        close_button = self.browser.find_element(By.CLASS_NAME, "class-close-chat")
        close_button.click()
        time.sleep(2)
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.XPATH, "//h4[contains(.,'Cerrar sesión')]").click()
        time.sleep(2)

        # Nos logueamos con el usuario propietario
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()
        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(2)

        # Hacemos click en el icono de chats y abrimos el mensaje que nos ha enviado el usuario inquilino
        chat_btn = self.browser.find_element(By.CSS_SELECTOR, '.class-chat-btn')
        chat_btn.click()
        time.sleep(2)
        chat_group_element = self.browser.find_element(By.CLASS_NAME, "class-chat-group")
        chat_group_element.click()
        time.sleep(3)


    





