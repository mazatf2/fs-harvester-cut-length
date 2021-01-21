#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

global currentLen := -1
global maxLen := 8

fetchLen() {
	whr := ComObjCreate("WinHttp.WinHttpRequest.5.1")
	whr.Open("GET", "http://localhost:3001/api/number", true)
	whr.Send()
	whr.WaitForResponse()
	value := whr.ResponseText
	return value
}

apiScreenshot(){
	if !WinExist("Farming Simulator 19"){
		return -1
	}

	whr := ComObjCreate("WinHttp.WinHttpRequest.5.1")
	whr.Open("GET", "http://localhost:3001/api/take_screenshot", true)
	whr.Send()
	whr.WaitForResponse()
	value := whr.ResponseText
	return value
}

init(){
	apiScreenshot()
}
init()

loopTo(to){
	if !WinExist("Farming Simulator 19"){
		return
	}

	times := 0
	currentLen := fetchLen()

	if(currentLen == -1){
		 return
	}
	if(currentLen == to){
		times := 0
		return
	}
	if(to > currentLen){
		times := to - currentLen
	}
	if(currentLen>to){
		distanceMax := maxLen - currentLen
		times := distanceMax + to
	}

	;msgbox, %currentLen% %to% %times%? max %maxLen%

	Loop, %times% {
			;toClient {y}
			send {y}
			sleep, 190
		}

	apiScreenshot()
}

doLoop(to){
	if !WinExist("Farming Simulator 19") {
		return
	}

	loopTo(to)
	sleep, 5000
	loopTo(to)
}

;Key list https://www.autohotkey.com/docs/KeyList.htm
;Joy1 = joystick/gamepad button 1

Numpad1::
	doLoop(1)
return
Numpad2::
	doLoop(2)
return
Numpad3::
	doLoop(3)
return
Numpad4::
	doLoop(4)
return
Numpad5::
	doLoop(5)
return
Numpad6::
	doLoop(6)
return
Numpad7::
	doLoop(7)
return
Numpad8::
	doLoop(8)
return

left::
	loopTo(3)
return
right::
	loopTo(5)
return

Joy6::
	length := length - 1
	loop, 15 {
		;toClient {y}
		sleep, 160
	}

return