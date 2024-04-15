#include <DHT.h>
#include <WiFiClient.h>
#include <WiFi.h>

const char* ssid = "****";
const char* password = "*****";
const char* serverIP = "******";
const int serverPort = 3000; // Port sur lequel votre serveur écoute

int gateway_id = 1; // ID de votre passerelle

#define DHTPIN 35     // Broche de données du capteur DHT
#define DHTTYPE DHT22   // Type de capteur DHT

DHT dht(DHTPIN, DHTTYPE);


const int vibrationPin = 34; // Broche analogique à laquelle le capteur de vibration est connecté
const int threshold = 3000;   // Seuil de détection de vibration, ajustez selon vos besoins
int mode = 2; // Mode par défaut : mesure de vibration

void setup() {
  Serial.begin(115200);
  delay(100);
  
  dht.begin();

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
  switch(mode) {
    case 1: // Mode 1 : Mesure de vibration
      measureAndSendVibration();
      break;
    
    case 2: // Mode 2 : Mesure de température et d'humidité
      measureAndSendTemperature();
      delay(5000);
      measureAndSendHumidity();
      delay(5000);
      break;
  }




}

void measureAndSendVibration() {
  float vibration = 0;
  
  if (analogRead(vibrationPin) > threshold) {
    Serial.println("Vibration détectée !");
    vibration = 1;
      sendDataToServer(2, 1, "binary");

  }
 
 
}






void measureAndSendTemperature() {
  // Mesurer la température
  float temperature = dht.readTemperature();

  // Vérifier si la mesure est valide
  if (!isnan(temperature)) {
    // Envoyer la température au serveur
    sendDataToServer(1,temperature, "Celsius");
  } else {
    Serial.println("Erreur lors de la mesure de la température");
    return;
  }
}

void measureAndSendHumidity() {
  // Mesurer l'humidité
  float humidity = dht.readHumidity();

  // Vérifier si la mesure est valide
  if (!isnan(humidity)) {
    // Envoyer l'humidité au serveur
    sendDataToServer(1,humidity, "Percent");
  } else {
    Serial.println("Erreur lors de la mesure de l'humidité");
    return;
  }
}

void sendDataToServer(float sensor_id,float data, String unit) {
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








