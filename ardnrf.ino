#include <SPI.h>
#include <RF24.h>
#include <DHT.h>

#define DHTPIN A1
#define LDRPIN A0
#define DHTTYPE DHT22

RF24 radio(9, 10); // CE, CSN
DHT dht(DHTPIN, DHTTYPE);

const byte address[6] = "00001";


void setup() {
  Serial.begin(9600);
  radio.begin();
  radio.openWritingPipe(address);
  dht.begin();
  pinMode(LDRPIN, INPUT);

  if (radio.isChipConnected()) {
    Serial.println(F("NRF24L01 module connected successfully!"));
  } else {
    Serial.println(F("Error: Unable to connect to NRF24L01 module."));
  }
}

void loop() {
  // Lecture des données du DHT22
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Envoi des données
  sendSensorData(1, 1, humidity, "Pourcentage");
  delay(2000);
  sendSensorData(1, 1, temperature, "Celsius");
  delay(2000);
  int luminosity = analogRead(LDRPIN);
  sendSensorData(1, 2, luminosity, "Lux");
  delay(2000);
}

void sendSensorData(int id_gateway, int id_capteur, float mesure, String unite) {


  String dataToSend = String(id_gateway) + "," + String(id_capteur) + "," + String(mesure) + "," + unite;

  if (radio.write(dataToSend.c_str(), dataToSend.length())) {
    Serial.println("Données envoyées avec succès.");
  } else {
    Serial.println("Échec de l'envoi des données.");
  }

  delay(6000);

}
