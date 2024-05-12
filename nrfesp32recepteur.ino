#include <WiFiClient.h>
#include <WiFi.h>
#include <SPI.h>
#include <RF24.h>

RF24 radio(21, 22); // Pin CE, CSN

const byte address[6] = "00001"; // Adresse de transmission


const char* ssid = "****";
const char* password = "******";
const char* serverIP = "*******";
const int serverPort = 3000; // Port sur lequel votre serveur écoute



void setup() {
  Serial.begin(115200);


 radio.begin();
  radio.openReadingPipe(1, address);
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
}

void loop() {
  if (radio.available()) {
    char dataReceived[32]; // Taille de la chaîne de caractères reçue
    radio.read(&dataReceived, sizeof(dataReceived));
    String dataString = String(dataReceived);

    // Extraction des valeurs
    int id_gateway = dataString.substring(0, dataString.indexOf(',')).toInt();
    dataString = dataString.substring(dataString.indexOf(',') + 1);
    int id_capteur = dataString.substring(0, dataString.indexOf(',')).toInt();
    dataString = dataString.substring(dataString.indexOf(',') + 1);
    float mesure = dataString.substring(0, dataString.indexOf(',')).toFloat();
    dataString = dataString.substring(dataString.indexOf(',') + 1);
    String unite = dataString;

  Serial.print("ID Gateway: ");
Serial.print(id_gateway);
Serial.print(" - ID Capteur: ");
Serial.print(id_capteur);
Serial.print(" - Mesure: ");
Serial.print(mesure);
Serial.print(" - Unité: ");
Serial.println(unite);

sendDataToServer(id_capteur,id_gateway,mesure,unite);

    delay(5000);
  }




}



void sendDataToServer(int sensor_id,int gateway_id,float data, String unit) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    if (client.connect(serverIP, serverPort)) {
      Serial.println("Connexion au serveur établie");

      // Construction des données JSON à envoyer
     String postData = "{\"sensor_id\": " + String(sensor_id) +
                        ", \"gateway_id\": " + String(gateway_id) +
                        ", \"measurement\": " + String(data) +
                        ", \"measurement_accuracy\": 0.0" +
                        ", \"unit\": \"" + unit + "\"}";
        
      // Création de la requête HTTP POST
      client.println("POST /api/datacollected HTTP/1.1");
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







