export default function ToggleView(curView) {
	if(curView == "student") {
		localStorage.setItem("view", "tutor");
	} else {
		localStorage.setItem("view", "student");
	}
}