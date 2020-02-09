import Vue from "vue";

Vue.filter("uppercase", (val: string) => val.toUpperCase());

Vue.filter("toDate", (date: Date) => {
	const dateArr = date.toLocaleDateString().split("/");
	if (dateArr[0] && dateArr[1] && dateArr[2]) {
		return `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`;
	} else {
		return date.toLocaleDateString();
	}
});
