import type {AppProps} from 'next/app';
import Head from 'next/head';
import 'antd/dist/reset.css';
import pkg from '../../package.json';
import '@/styles/vars.css';
import '@/styles/global.css';
import '@/styles/print.css';

const {prettyName: appName, website} = pkg;

export default function MyApp({Component, pageProps}: AppProps) {
	return (
		<>
			<Head>
				<meta charSet='utf-8'/>
				<meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
				<meta
					name='viewport'
					content='width=device-width,initial-scale=1'
				/>

				<meta name='application-name' content={appName}/>
				<meta name='apple-mobile-web-app-capable' content='yes'/>
				<meta name='apple-mobile-web-app-status-bar-style' content='default'/>
				<meta name='apple-mobile-web-app-title' content={appName}/>
				{/* <meta name="description" content="Best PWA App in the world" /> */}
				<meta name='format-detection' content='telephone=no'/>
				<meta name='mobile-web-app-capable' content='yes'/>
				{/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
				<meta name='msapplication-TileColor' content='#2B5797'/>
				<meta name='msapplication-tap-highlight' content='no'/>
				<meta name='theme-color' content='#317EFB'/>

				<link rel='apple-touch-icon' href='/icons/logo-192x192.png'/>
				<link
					rel='apple-touch-icon'
					sizes='152x152'
					href='/icons/logo-152x152.png'
				/>
				{/* <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
				<link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" /> */}

				<link
					href='/icons/logo-32x32.png'
					rel='icon'
					type='image/png'
					sizes='32x32'
				/>
				<link
					href='/icons/logo-16x16.png'
					rel='icon'
					type='image/png'
					sizes='16x16'
				/>
				<link rel='manifest' href='site.webmanifest'/>

				<meta name='twitter:card' content='summary'/>
				<meta name='twitter:url' content={website}/>
				<meta name='twitter:title' content={appName}/>
				{/* <meta name="twitter:description" content="Best PWA App in the world" /> */}
				<meta name='twitter:image' content={`${website}logo-192x192.png`}/>
				{/* <meta name="twitter:creator" content="@DavidWShadow" /> */}
				<meta property='og:type' content='website'/>
				<meta property='og:title' content={appName}/>
				{/* <meta property="og:description" content="Best PWA App in the world" /> */}
				<meta property='og:site_name' content={appName}/>
				<meta property='og:url' content={website}/>
				<meta property='og:image' content={`${website}logo-192x192.png`}/>
			</Head>

			<Component {...pageProps}/>
		</>
	);
}
