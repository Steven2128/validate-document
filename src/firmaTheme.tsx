import React from 'react';
import './css/style.css';
import './css/responsive.css';

const favicon = document.getElementById("favicon") as HTMLAnchorElement | null;
if (favicon !== null) {
    favicon.href = 'favicon.ico';
}
const FirmaTheme = () => (<React.Fragment></React.Fragment>);
export default FirmaTheme;
