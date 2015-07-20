var main = function()
{
	var rawDate = new Date();
	date = [rawDate.getDate(), rawDate.getMonth(), rawDate.getFullYear(), rawDate.getHours(), rawDate.getMinutes(), "MSK"].join('_');

	var defaultWeightLines = script.readAll("/home/root/defaultWeight.txt");
	var avg0 = defaultWeightLines[0];

	var weightSensor        = brick.sensor("W4");
	var lidSensor           = brick.sensor("W2");
	var innerTempSensor     = brick.sensor("T1");
	var outerTempSensor     = brick.sensor("T2");
	var innerHumiditySensor = brick.sensor("A2");
	var outerHumiditySensor = brick.sensor("A1");
	var battery             = brick.battery();
	var display             = brick.display();

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
	script.system("/home/root/make_photo.sh /home/root/audio-records/" + date + "/photo.jpg");

	var time = 300;

	//weight sensor routines
	var a1 = weightSensor.readRawData();
	var avg1 = a1 - avg0;
	var m1 = avg1 / 10;

	//humidity sensor routines
	var rawInnerHumidity = innerHumiditySensor.readRawData();
	var innerHumidity = Math.round(30.43 * (rawInnerHumidity / 1023.0 *3.3 * 2) - 25.81);

	var rawOuterHumidity = outerHumiditySensor.readRawData();
	var outerHumidity = Math.round(30.43 * (rawOuterHumidity / 1023.0 *3.3 * 2) - 25.81);

	//temperature sensor reading
	var t1 = innerTempSensor.readRawData();
	var t2 = outerTempSensor.readRawData();

	//check if hive's top closed
	var rawLidData = lidSensor.readRawData();
	var safeClosed = true;
	if (rawLidData != 0) {
		safeClosed = false; 
	};

	//init min/max values for all sensors
	var innerTempMin = t1;
	var innerTempMax = t1;
	var outerTempMin = t2;
	var outerTempMax = t2;
	var innerHumidMin = innerHumidity;
	var innerHumidMax = innerHumidity;
	var outerHumidMin = outerHumidity;
	var outerHumidMax = outerHumidity;
	var weightMin = m1;
	var weightMax = m1;

	display.clear();
	while (time != 0) {
		display.clear();
		a1 = weightSensor.readRawData();
		avg1 = a1 - avg0;
		m1 = avg1 / 10;
	
		rawInnerHumidity = innerHumiditySensor.readRawData();
		innerHumidity = Math.round(30.43 * (rawInnerHumidity / 1023.0 *3.3 * 2) - 25.81);

		rawOuterHumidity = outerHumiditySensor.readRawData();
		outerHumidity = Math.round(30.43 * (rawOuterHumidity / 1023.0 *3.3 * 2) - 25.81);

		t1 = innerTempSensor.readRawData();
		t2 = outerTempSensor.readRawData();

		rawLidData = lidSensor.readRawData();

		if (t1 < innerTempMin) { innerTempMin = t1; } else if (t1 > innerTempMax) { innerTempMax = t1; }
		if (t2 < outerTempMin) { outerTempMin = t2; } else if (t2 > outerTempMax) { outerTempMax = t2; }
		if (innerHumidity < innerHumidMin) { innerHumidMin = innerHumidity; } else if (innerHumidity > innerHumidMax) { innerHumidMax = innerHumidity; }
		if (outerHumidity < outerHumidMin) { outerHumidMin = outerHumidity; } else if (outerHumidity > outerHumidMax) { outerHumidMax = outerHumidity; }
		if (m1 < weightMin) { weightMin = m1; } else if (m1 > weightMax) { weightMax = m1; }
		if (rawLidData != 0) { safeClosed = false; }

		display.addLabel("Inner temperature: " + t1 + " *C", 1, 1);
		display.addLabel("Outer temperature: " + t2 + " *C", 1, 17);
		display.addLabel("Inner humidity: " + innerHumidity + " %", 1, 33);
		display.addLabel("Outer humidity: " + outerHumidity + " %", 1, 50);
		display.addLabel("Weight: " + m1 + " kg", 1, 67);
		display.addLabel("Voltage: " + battery.readVoltage() + " V", 1, 83);
		display.addLabel("rawLidData: " + rawLidData + " popugaev", 1, 100);

		script.wait(5000);
		time = time - 5;
	}

	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Inner max temperature: " + innerTempMax + " *C\n" +
																		   "Inner min temperature: " + innerTempMin + " *C\n" + 
																		   "Inner average temperature: " + ((innerTempMax + innerTempMin) / 2) + " *C\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Outer max temperature: " + outerTempMax + " *C\n" +
																		   "Outer min temperature: " + outerTempMin + " *C\n" + 
																		   "Outer average temperature: " + ((outerTempMax + outerTempMin) / 2) + " *C\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Inner max humidity: " + innerHumidMax + " %\n" +
																		   "Inner min humidity: " + innerHumidMin + " %\n" +
																		   "Inner average humidity: " + ((innerHumidMax + innerHumidMin) / 2) + " %\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Outer max humidity: " + outerHumidMax + " %\n" +
																		   "Outer min humidity: " + outerHumidMin + " %\n" +
																		   "Outer average humidity: " + ((outerHumidMax + outerHumidMin) / 2) + " %\n");
	script.wait(300);
	script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Max weight: " + weightMax + " kg\n" +
																		   "Min weight: " + weightMin + " kg\n" +
																		   "Average weight: " + ((weightMax + weightMin) / 2) + " kg\n");
    script.wait(300);
    script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Battery voltage: " + battery.readVoltage() + "\n");
    script.wait(300);
    script.writeToFile("/home/root/audio-records/" + date + "/sensors_output.txt", "Lid was closed: " + safeClosed + "\n");
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
