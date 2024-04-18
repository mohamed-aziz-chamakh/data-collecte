#include "BluetoothSerial.h"
#include <WiFi.h>

//#define USE_PIN // Uncomment this to use PIN during pairing. The pin is specified on the line below
const char *pin = "1218"; // Change this to more secure PIN.

String device_name = "ESP32-BT-WIFI-CONTROLLER";
BluetoothSerial SerialBT;

int i = 0;
String incoming_char;
String SSIDIN;
String PASSIN;
String header;
String ssids_array[50];
String network_string;
String connected_string;

int startchar;
int endchar;

long start_wifi_millis;
long wifi_timeout = 10000;

void setup() {
 //pinMode(LED_BUILTIN, OUTPUT);
 Serial.begin(115200);
 // Initialize the output variables as outputs

 SerialBT.begin(device_name); //Bluetooth device name
 Serial.printf("Device name: \"%s\"\n", device_name.c_str());
 //Serial.printf("The device with name \"%s\" and MAC address %s is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str(), SerialBT.getMacString()); // Use this after the MAC method is implemented
 /*#ifdef USE_PIN
 SerialBT.setPin(pin);
 Serial.println("Using PIN");
 #endif*/

 //while (1);
}

void scan_wifi_networks()
{
 WiFi.mode(WIFI_STA);
 // WiFi.scanNetworks will return the number of networks found
 int n = WiFi.scanNetworks();
 if (n == 0) {
 SerialBT.println("no networks found");
 } else {
 SerialBT.println();
 SerialBT.print(n);
 SerialBT.println(" networks found");
 delay(1000);
 for (int i = 0; i < n; ++i) {
 ssids_array[i + 1] = WiFi.SSID(i);
 Serial.print(i + 1);
 Serial.print(": ");
 Serial.println(ssids_array[i + 1]);
 network_string = i + 1;
 network_string = network_string + ": " + WiFi.SSID(i) + " (Strength:" + WiFi.RSSI(i) + ")";
 SerialBT.println(network_string);
 }
 }
}

void disconnect_bluetooth()
{
 delay(1000);
 Serial.println("BT stopping");
 SerialBT.println("Bluetooth disconnecting...");
 delay(1000);
 SerialBT.flush();
 SerialBT.disconnect();
 SerialBT.end();
 Serial.println("BT stopped");
 delay(1000);
}

void loop() {


 while (!(SerialBT.available()));
     String command = SerialBT.readStringUntil('\n');

 if(command.startsWith("start"))
 {
 SerialBT.println("Scanning Wi-Fi networks");
 Serial.println("Scanning Wi-Fi networks");
 

 scan_wifi_networks();
A:
 SerialBT.println("Please enter the name of your WiFi.");
 while (!(SerialBT.available()));
 while (SerialBT.available()) {
 char c = SerialBT.read();
 incoming_char += c;
 Serial.write(c);
 }
 if (incoming_char.indexOf("ssid:") >= 0)
 {
 startchar = incoming_char.indexOf('<') + 1;
 endchar = incoming_char.indexOf('>', startchar);
 for (int i = startchar; i < endchar; i++)
 SSIDIN += incoming_char[i];
 Serial.println(SSIDIN);
 }
 else
 {
 SerialBT.println("Error:Enter SSID with following format -> ssid:...");
 goto A;
 }
 incoming_char = "";
 SerialBT.println("Please enter the password of your WiFi.");
 while (!(SerialBT.available()));
 while (SerialBT.available()) {
 char c = SerialBT.read();
 incoming_char += c;
 Serial.write(c);
 }
 if (incoming_char.indexOf("pass:") >= 0)
 {
 int startchar2 = incoming_char.indexOf('<') + 1;
 int endchar2 = incoming_char.indexOf('>', startchar2);
 for (int i = startchar2; i < endchar2; i++)
 PASSIN += incoming_char[i];
 Serial.println(PASSIN);
 }
 else
 {
 SerialBT.println("Error:Enter Pass with following format -> pass:...");
 goto A;
 }
 delay(500);

 SerialBT.println("Please wait for Wi-Fi connection...");
 Serial.println("Please wait for Wi_Fi connection...");
 //disconnect_bluetooth();

 start_wifi_millis = millis();
 const char* ssid = SSIDIN.c_str();
 const char* password = PASSIN.c_str();
 WiFi.begin(ssid, password);
 while (WiFi.status() != WL_CONNECTED) {
 delay(500);
 Serial.print(".");
 if (millis() - start_wifi_millis > wifi_timeout) {
 WiFi.disconnect(true, true);
 SerialBT.println("Could't connect to Wi-Fi...");
 Serial.println("Could't connect to Wi-Fi...");
 }
 }
 SerialBT.println("Connected");
 Serial.println("Connected");

 SerialBT.print("ESP32 IP: ");
 SerialBT.println(WiFi.localIP());
 Serial.print("ESP32 IP: ");
 Serial.println(WiFi.localIP());

 incoming_char = "";
 SSIDIN = "";
 PASSIN = "";

 }
 else
 {
 SerialBT.println("ERROR");


 }



}