import React from 'react';
import './kiai/css/style.css';
import './css/responsive.css';

const favicon = document.getElementById("favicon") as HTMLAnchorElement | null;
if (favicon !== null) {
    favicon.href = 'faviconKiai.ico';
}
const KiaiTheme = () => (<React.Fragment></React.Fragment>);
export default KiaiTheme;
