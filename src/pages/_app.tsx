import type {AppProps} from 'next/app';
import Head from 'next/head';
import 'antd/dist/reset.css';
import '@/styles/vars.css';
import '@/styles/global.css';
import '@/styles/print.css';

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

				<link rel='manifest' href='site.webmanifest'/>
				<link
					href='/icons/logo-16x16.png'
					rel='icon'
					type='image/png'
					sizes='16x16'
				/>
				<link
					href='/icons/logo-32x32.png'
					rel='icon'
					type='image/png'
					sizes='32x32'
				/>
				<link rel='apple-touch-icon' href='/icons/logo-192x192.png'/>
				<meta name='theme-color' content='#317EFB'/>
			</Head>

			<Component {...pageProps}/>
		</>
	);
}
