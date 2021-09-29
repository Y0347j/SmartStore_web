//#define LED 12

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  //pinMode(LED, OUTPUT);
}

void loop() {
  int incomingValue = 0;
  
  if (Serial.available() > 0) {
    incomingValue = Serial.read();
  }
  
  if (incomingValue == 49) {
    Serial.print("1");
    digitalWrite(LED_BUILTIN, HIGH); 
    //digitalWrite(LED, HIGH);
  } else if (incomingValue == 48) {
    Serial.print("0");
    digitalWrite(LED_BUILTIN, LOW); 
    //digitalWrite(LED, LOW);
  }

  delay(10);
}
