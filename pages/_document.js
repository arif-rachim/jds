import Document, {Head, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return {...initialProps}
    }

    render() {
        return (
            <html lang="en">
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/solid.css"
                      integrity="sha384-osqezT+30O6N/vsMqwW8Ch6wKlMofqueuia2H7fePy42uC05rm1G+BUPSd2iBSJL"
                      crossOrigin="anonymous"></link>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/fontawesome.css"
                      integrity="sha384-BzCy2fixOYd0HObpx3GMefNqdbA7Qjcc91RgYeDjrHTIEXqiF00jKvgQG0+zY/7I"
                      crossOrigin="anonymous"></link>
                <link rel="stylesheet"
                      href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                      integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
                      crossOrigin="anonymous"></link>

            </Head>
            <body >
            <Main/>
            <NextScript/>
            </body>

            </html>
        )
    }
}