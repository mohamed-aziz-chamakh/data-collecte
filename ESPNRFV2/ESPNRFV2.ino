#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

#include <WiFiClient.h>
#include <WiFi.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
RF24 radio(21, 22); // CE, CSN

const byte address[6] = "00001"; // Adresse de transmission


const char* ssid = "OPPO7";
const char* password = "aziz2001";
const char* serverIP = "197.12.9.39";
const int serverPort = 8011; // Port sur lequel votre serveur écoute

// Création d'une instance TinyGPS++
TinyGPSPlus gps;

// Utilisation du second port série matériel de l'ESP32
HardwareSerial ss(2);
double latitude = 0.0;
double longitude = 0.0;
double altitude = 0.0;
void setup() {
  Serial.begin(9600);
  radio.begin();
  radio.openReadingPipe(1, address);
  radio.setPALevel(RF24_PA_MIN);
  radio.startListening();


 // Connexion au réseau Wi-Fi
  Serial.println();
  Serial.println("Connexion au réseau Wi-Fi");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connecté");

 ss.begin(9600, SERIAL_8N1, 16, 17); // Port série pour le GPS (RX, TX)

  Serial.println("GPS Initialisation...");

}

void loop() {
  if (radio.available()) {
    char dataReceived[32] = {0}; // Taille du tampon de réception
    radio.read(&dataReceived, sizeof(dataReceived));
    String dataString = String(dataReceived);

    // Extraction des valeurs
    String adresse_gateway = dataString.substring(0, dataString.indexOf(','));
    dataString = dataString.substring(dataString.indexOf(',') + 1);
    String adresse_sensor = dataString.substring(0, dataString.indexOf(','));
    dataString = dataString.substring(dataString.indexOf(',') + 1);
    float mesure = dataString.substring(0, dataString.indexOf(',')).toFloat();
    dataString = dataString.substring(dataString.indexOf(',') + 1);
    String unite = dataString;

    // Affichage des valeurs en une seule ligne
    Serial.print("Adresse Gateway: ");
    Serial.print(adresse_gateway);
    Serial.print(", Adresse Sensor: ");
    Serial.print(adresse_sensor);
    Serial.print(", Mesure: ");
    Serial.print(mesure);
    Serial.print(", Unité: ");
    Serial.println(unite); 


localisation();

 latitude = gps.location.lat();
    longitude = gps.location.lng();
    altitude = gps.altitude.meters();

    

    sendDataToServer( adresse_sensor , adresse_gateway,mesure,unite,latitude,longitude,altitude);

    

    delay(5000);
  }
}




void sendDataToServer(String adresseS ,String adresseG,float data, String unit,double latitude,double longitude,double altitude) {
 
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    if (client.connect(serverIP, serverPort)) {
      Serial.println("Connexion au serveur établie");

      // Construction des données JSON à envoyer
    String postData = "{\"address_mac_sensor\": \"" + adresseS + "\"" +
                    ",\"address_mac_gateway\": \"" + adresseG + "\"" +
                    ", \"measurement\": " + String(data) +
                    ", \"measurement_accuracy\": 0.0" +
                    ", \"unit\": \"" + unit + "\"" +
                    ", \"latitude\": " + String(latitude, 6) +
                    ", \"longitude\": " + String(longitude, 6) +
                    ", \"altitude\": " + String(altitude) +
                    "}";
        
      // Création de la requête HTTP POST
      client.println("POST /api/data/collect/from/sensors/add HTTP/1.1");
      client.println("Host: " + String(serverIP));
      client.println("Content-Type: application/json");
      client.print("Content-Length: ");
      client.println(postData.length());
      client.println();
      client.println(postData);

      // Lecture de la réponse du serveur
      while (client.connected()) {
        if (client.available()) {
          String response = client.readStringUntil('\r');
          Serial.println(response);
        }
      }

      client.stop();
      Serial.println("Déconnexion du serveur");
    } else {
      Serial.println("Impossible de se connecter au serveur");
    }
  } else {
    Serial.println("Connexion au réseau Wi-Fi perdue");
  }
}

void localisation()

{

  // Lecture des données du GPS
  while (ss.available() > 0) {
    char c = ss.read();
    gps.encode(c);
  }

  // Affichage des informations GPS si disponibles et valides
  if (gps.location.isValid()) {
    Serial.print("Latitude: ");
    Serial.println(gps.location.lat(), 6); // Affiche la latitude avec 6 décimales
    Serial.print("Longitude: ");
    Serial.println(gps.location.lng(), 6); // Affiche la longitude avec 6 décimales
    Serial.print("Altitude: ");
    Serial.println(gps.altitude.meters()); // Affiche l'altitude en mètres
    Serial.println();
  } else {
    Serial.println("En attente de données GPS valides...");
  }

  // Petit délai pour éviter l'inondation du port série
  delay(5000);


}




