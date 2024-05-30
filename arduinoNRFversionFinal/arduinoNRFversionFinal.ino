#include <SPI.h>
#include <RF24.h>
#include <DHT.h>

#define DHTPIN A1
#define LDRPIN A0
#define DHTTYPE DHT22
#define VIBRATIONPIN A3 // Pin for vibration sensor

RF24 radio(9, 10); // CE, CSN
DHT dht(DHTPIN, DHTTYPE);

const byte address[6] = "00001";

void setup() {
  Serial.begin(9600);
  radio.begin();
  radio.openWritingPipe(address);
  dht.begin();
  pinMode(LDRPIN, INPUT);
  pinMode(VIBRATIONPIN, INPUT);

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
  
  // Envoi des données du DHT22
  sendSensorData("30:AE", "AB:C6", humidity, "%");
  delay(2000);
  sendSensorData("30:AE", "AB:CD", temperature, "C");
  delay(2000);

  // Lecture des données du capteur LDR
  int luminosity = analogRead(LDRPIN);
  sendSensorData("30:AE", "BC:DE", luminosity, "Lux");
  delay(2000);

  // Lecture des données du capteur de vibration S801
  int vibration = analogRead(VIBRATIONPIN);
  Serial.println(vibration);

  sendSensorData("30:AE", "DE:FG", vibration, "mm/s");
  delay(2000);
}

void sendSensorData(String adresse_gateway, String adresse_sensor, float mesure, String unite) {
  String dataToSend = adresse_gateway + "," + adresse_sensor + "," + String(mesure) + "," + unite;

  if (radio.write(dataToSend.c_str(), dataToSend.length())) {
    Serial.println("Données envoyées avec succès.");
  } else {
    Serial.println("Échec de l'envoi des données.");
  }

  delay(6000);
}
