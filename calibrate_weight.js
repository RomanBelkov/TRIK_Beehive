var main = function() {
	brick.display().addLabel("Для замера тары", 0, 120);
	brick.display().addLabel("нажмите кнопку ОК.", 0, 140);

	while (!brick.keys().wasPressed(KeysEnum.Enter)) { 
		script.wait(100);
	}

	script.removeFile("/home/root/defaultWeight.txt");

	newDefaultWeight = brick.sensor("W4").readRawData();
	script.writeToFile("/home/root/defaultWeight.txt", newDefaultWeight);
	return;
}