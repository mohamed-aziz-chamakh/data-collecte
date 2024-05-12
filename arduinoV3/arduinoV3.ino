#include <SPI.h>
#include <RF24.h>

RF24 radio(9, 10); // Pin CE, CSN

const byte address[6] = "00001"; // Adresse de transmission

void setup() {
  Serial.begin(9600);
  radio.begin();
  radio.openWritingPipe(address);
}

void loop() {
  int id_gateway = 123; // Exemple d'ID Gateway
  int id_capteur = 456; // Exemple d'ID Capteur
  float mesure = 25.5; // Exemple de Mesure
  String unite = "C"; // Exemple d'Unité

  String dataToSend = String(id_gateway) + "," + String(id_capteur) + "," + String(mesure) + "," + unite;

  if (radio.write(dataToSend.c_str(), dataToSend.length())) {
    Serial.println("Données envoyées avec succès.");
  } else {
    Serial.println("Échec de l'envoi des données.");
  }

  delay(1000);
}
