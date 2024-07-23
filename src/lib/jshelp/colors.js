export function settingsChecker(setting = "ALL") {
    if (setting === "ALL" || setting === "colors") {
        if (localStorage.getItem('bWEemu') === '3ojnKb') {
            document.documentElement.style.setProperty('--main-color', '#d15dff');
            document.documentElement.style.setProperty('--main-lite', '#d5a4e9');
        } else {
            document.documentElement.style.setProperty('--main-color', '#25dfd4');
            document.documentElement.style.setProperty('--main-lite', '#98e4df');
        }
    }

}