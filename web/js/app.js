const React = require("react");
const ReactDOM = require("react-dom");
const $ = require("jquery");
const injectTapEventPlugin = require("react-tap-event-plugin");
const getMuiTheme = require("material-ui/styles/getMuiTheme").default;
const MuiThemeProvider = require("material-ui/styles/MuiThemeProvider").default;
const Routes = require("./components/Routes");
const _http = require("./util/http/_http");
const authInterceptor = require("./util/http/authInterceptor");
const colors = require("./config-values/colors");

injectTapEventPlugin();

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: colors.primary1,
		primary2Color: colors.primary2,
		//primary3Color: grey400,
		accent1Color: colors.accent1,
		//accent2Color: grey100,
		//accent3Color: grey500,
		//textColor: colors.lightBlack,
		//alternateTextColor: colors.white,
		//canvasColor: white,
		//borderColor: grey300,
		//disabledColor: fade(darkBlack, 0.3),
		pickerHeaderColor: colors.primary1
		//clockCircleColor: fade(darkBlack, 0.07),
		//shadowColor: fullBlack
	}
});

_http.registerInterceptor(authInterceptor);

$(function () {
	ReactDOM.render((
		<MuiThemeProvider muiTheme={muiTheme}>
			<section>
				<Routes/>
			</section>
		</MuiThemeProvider>
	), document.getElementById("app"))
});