# IoT Mid-Sem — Quick Revision Answers

## 2 MARKS

**1. What is IoT? Real-life examples**
IoT = network of interconnected devices/objects with sensors & software that collect and exchange data over the internet.
Example: **Smart Home** — thermostats, lights, cameras, locks controlled remotely via app or automated rules.

**2. 6 Applications of IoT**
Smart Home, Smart Agriculture, Smart Healthcare, Smart City, Smart Vehicle Tracking, Smart Industry.

**3. Full forms: MQTT, HTTP, CoAP, WSN**
- MQTT – Message Queuing Telemetry Transport
- HTTP – Hypertext Transfer Protocol
- CoAP – Constrained Application Protocol
- WSN – Wireless Sensor Network

**4. Full form: IAAS, PAAS, SAAS**
- IaaS – Infrastructure as a Service
- PaaS – Platform as a Service
- SaaS – Software as a Service

**5. Full form: MQTT, HTTP, CoAP, AMQP**
- MQTT – Message Queuing Telemetry Transport
- HTTP – Hypertext Transfer Protocol
- CoAP – Constrained Application Protocol
- AMQP – Advanced Message Queuing Protocol

**6. Define Sensor and Actuator**
- **Sensor**: device that detects environmental changes and converts them to electrical signals.
- **Actuator**: device that performs a physical action based on a received command (e.g., motor, relay, buzzer).

**7. What is Arduino UNO?**
A standard Arduino board based on ATmega328P microcontroller with 14 digital pins, 6 analog pins, USB port, power jack — used for prototyping electronics projects.

**8. 5 characteristics of Big Data Analytics**
Volume, Velocity, Variety, Data cleaning/Munging, Processing & Visualization steps.

**9. Communication protocols — list**
Rules governing data format/transmission between devices.
List: MQTT, CoAP, HTTP, AMQP, WebSocket, DDS, TCP, UDP, XMPP.

**10. 5 types of Arduino boards**
Arduino UNO, LilyPad, Arduino Mega, Arduino RedBoard, Arduino Shields.

**11. Define Microcontroller**
A self-contained chip (CPU + memory + I/O) used in embedded systems to perform a specific control task, often low-power.

**12. Types of sensors used in IoT**
Temperature, Humidity, Motion (PIR), Ultrasonic, Light, Pressure, Proximity sensors.

---

## 4/5 MARKS

**13. Advantages & Disadvantages of IoT**
*Advantages*: Efficiency, Cost savings, Enhanced monitoring/control, Improved quality of life, Data-driven insights, Environmental benefits.
*Disadvantages (challenges)*: Security risks, Privacy issues, Scalability problems, Interoperability issues (lack of standard protocols).

**14/24. Characteristics of IoT**
- Connectivity – devices always connectable
- Intelligence & Identity – meaningful data extraction
- Scalability – handles growing devices
- Dynamic & Self-Adapting – adjusts to context
- Architecture – hybrid, supports multiple vendors
- Safety – protects personal data

**15/23. IoT Levels (any 3, incl. Level 3 & 4)**
- **Level 1**: Single node does sensing+actuation+storage+app locally. Low cost. Ex: Smart home.
- **Level 2**: Single node senses/actuates + local analysis; data stored & app hosted on cloud. Ex: Smart factory.
- **Level 3**: Local sensors+controller; network & server (analysis/storage) on cloud. Good for big/varying data. Ex: Smart industry.
- **Level 4**: Multiple nodes, local analysis, cloud storage/app, has observer nodes. For big data + heavy computation. Ex: Courier tracking.

**16/20. WSN — What & how used**
Infrastructure-less wireless network of many distributed sensor nodes monitoring physical/environmental conditions, connected to a Base Station.
Components: Sensors, Radio Nodes, LAN Access Point, Evaluation Software.
Used in IoT for: environmental monitoring, healthcare, agriculture, surveillance, disaster detection.

**17. IoT Communication APIs**
- **REST-based API**: Request-Response, client-server, stateless (uses HTTP).
- **WebSocket API**: Full-duplex, persistent connection, event-driven, real-time data exchange.

**18. Wired vs Wireless Protocol (with example)**
- **Wired**: Uses physical cables. Example: Ethernet (fast, stable, used in industrial IoT).
- **Wireless**: No cables, uses radio waves. Example: Wi-Fi, Bluetooth, ZigBee (flexible, mobile use).

**19. Any two Communication Models**
- **Request-Response**: Client sends request → Server processes → sends encoded response. Stateless.
- **Publish-Subscribe**: Publisher sends data to Broker (topic) → Subscribers receive from Broker; publisher/subscriber unaware of each other.
(Others: Push-Pull, Exclusive Pair)

**21. Physical Layer of IoT (Perception Layer)**
Lowest layer of IoT architecture; consists of sensors, RFID tags, cameras, GPS, actuators; collects raw data from physical environment. Ex: temperature sensor reads room temp.

**22. Arduino — types (any 2)**
Arduino = open-source microcontroller board for embedded projects.
- **UNO**: ATmega328P, 14 digital + 6 analog pins, USB, beginner-friendly.
- **Mega**: More I/O pins, more memory, multiple serial ports — for complex projects (robotics, 3D printers).

**25. Wi-Fi, Bluetooth, ZigBee in IoT**
- **Wi-Fi**: Broadband wireless, supports high bandwidth apps (video, security cams), varying power/range.
- **Bluetooth**: Short-range, low power, device-to-device pairing.
- **ZigBee**: IEEE 802.15.4 based, low-power, low-data-rate, mesh topology, used in smart lighting/sensors.

**26. IoT Architecture (4 layers) — with diagram**
1. **Perception Layer** – sensors/actuators collect data.
2. **Network Layer** – transmits data via Wi-Fi/Bluetooth/ZigBee/Ethernet.
3. **Processing Layer (Middleware)** – cloud storage, analytics, converts raw data to info.
4. **Application Layer** – delivers services (smart home, healthcare, city, agriculture).

**27. Arduino coding structure + LCD interfacing**
Arduino code has two main functions:
- `setup()` – runs once, initializes pins/settings.
- `loop()` – runs repeatedly, contains main logic.
LCD interfacing: Connect RS, Enable, D4–D7 pins of 16x2 LCD to Arduino digital pins; use `LiquidCrystal` library to display sensor data (e.g., temperature).

**28/31. Arduino UNO Architecture (draw & explain)**
Based on ATmega328P (28-pin), 8-bit CPU.
Key blocks: CPU, Flash Program Memory, Data SRAM, EEPROM, 32×8 General Purpose Registers, ALU, I/O Modules, Interrupt Unit, SPI Unit, Watchdog Timer, Analog Comparator — all connected via 8-bit Data Bus.
Pins: 14 digital I/O (6 PWM), 6 analog input, AREF (analog reference), Reset pin, 16MHz crystal oscillator, USB, power jack.

**29. Challenges in IoT + role of sensing**
Challenges: **Security** (hacking/malware), **Privacy** (data leakage), **Scalability** (handling many devices), **Interoperability** (different protocols/standards).
Role of sensing: Sensors gather real-time environmental data — the foundation for actuation and decision-making in every IoT system (e.g., soil sensor → irrigation control).

**30. Smart City — features**
An IoT-based smart city uses connected sensors/devices to manage city resources efficiently.
Features: Smart traffic management, smart street lighting, smart waste management, smart parking, smart energy grids, public safety/surveillance, environmental monitoring.

**32. Sensor-Actuator system using Arduino (example)**
Example: **Smart Irrigation System**
1. Soil moisture sensor measures moisture → sends data to Arduino.
2. Arduino (controller) compares with threshold.
3. If moisture is low → Arduino sends signal to actuator (water pump) → pump turns ON.
4. When moisture is sufficient → pump turns OFF automatically.
Flow: **Sensor → Controller (decision) → Actuator (action)**

---
*All answers condensed from your IoT Question Bank (Parul Institute, 5th Sem, 03606317).*
 