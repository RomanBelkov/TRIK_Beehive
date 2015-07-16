var main = function()
{
	var rawDate = new Date();
	date = [rawDate.getDate(), rawDate.getMonth(), rawDate.getFullYear()].join('_') + ('_') +  rawDate.getHours() + "\:" + rawDate.getMinutes() + "_MSK" ;

	var defaultWeightLines = script.readAll("/home/root/defaultWeight.txt");
	var avg0 = defaultWeightLines[0];

	var weightSensor   = brick.sensor("W4");
	var tempSensor     = brick.sensor("T1");
	var humiditySensor = brick.sensor("A4");
	var battery        = brick.battery();
	var display        = brick.display();

	script.system("mkdir /home/root/audio-records/" + date);
	script.wait(500);
	//script.system('echo "+-------------------+" >> /home/root/audio-records/' + date + '/sensors_output.txt');
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "+-------------------+\n");
	script.wait(300);
	//script.system("echo " + date + " >> /home/root/audio-records/" + date + "/sensors_output.txt");
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", date + "\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Battery voltage: " + battery.readVoltage() + "\n");
    script.wait(300);

	script.system("arecord -f cd -d 300 --use-strftime /home/root/audio-records/" + date + "/audio_record.wav");

	var time = 300;

	//weight sensor routines
	var a1 = weightSensor.readRawData();
	var avg1 = a1 - avg0;
	var m1 = avg1 / 10;

	//humidity sensor routines
	var a4 = humiditySensor.readRawData();
	var u1 = a4 / 1023.0 *3.3 * 2;
	var h1 = Math.round(30.43 * u1 - 25.81);

	//temperature sensor reading
	var t1 = tempSensor.readRawData();

	//init min/max values for all sensors
	var tempMin = t1;
	var tempMax = t1;
	var humidMin = h1;
	var humidMax = h1;
	var weightMin = m1;
	var weightMax = m1;

	display.clear();

	while (time != 0) {
		display.clear();
		a1 = weightSensor.readRawData();
		avg1 = a1 - avg0;
		m1 = avg1 / 10;
	
		a4 = humiditySensor.readRawData();
		u1 = a4 / 1023.0 *3.3 * 2;
		h1 = Math.round(30.43 * u1 - 25.81);

		t1 = tempSensor.readRawData();

		display.addLabel("Temperature: " + t1 + " *C", 1, 1);
		display.addLabel("Humidity: " + h1 + " %", 1, 17);
		display.addLabel("Weight: " + m1 + " kg", 1, 33);
		display.addLabel("Voltage: " + battery.readVoltage() + " V", 1, 50);

		if (t1 < tempMin) { tempMin = t1; } else if (t1 > tempMax) { tempMax = t1; }
		if (h1 < humidMin) { humidMin = h1; } else if (h1 > humidMax) { humidMax = h1; }
		if (m1 < weightMin) { weightMin = m1; } else if (m1 > weightMax) { weightMax = m1; }

		script.wait(5000);
		time = time - 5;
	}

	display.clear();

	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Max temperature: " + tempMax + " *C\n" +
																		   "Min temperature: " + tempMin + " *C\n" + 
																		   "Average temperature: " + ((tempMax + tempMin) / 2) + " *C\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Max humidity: " + humidMax + " %\n" +
																		   "Min humidity: " + humidMin + " %\n" +
																		   "Average humidity: " + ((humidMax + humidMin) / 2) + " %\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Max weight: " + weightMax + " kg\n" +
																		   "Min weight: " + weightMin + " kg\n" +
																		   "Average weight: " + ((weightMax + weightMin) / 2) + " kg\n");
    script.wait(300);

    script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Battery voltage: " + battery.readVoltage() + "\n");
    script.wait(300);

	//script.system('echo "+-------------------+" >> /home/root/audio-records/' + date + '/sensors_output.txt');
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "+-------------------+\n");
	script.wait(300);
	script.system("sync");
	script.wait(500);
	script.system("hwclock -wl");
	script.wait(2000);

	return;
}
