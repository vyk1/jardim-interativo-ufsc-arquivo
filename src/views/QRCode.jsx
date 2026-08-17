import AdminHelmet from 'components/Helmet/AdminHelmet';

var QRCode = require('qrcode.react');
var React = require('react');

export default class QRCodeClass extends React.Component {
    constructor(props) {
        super(props)

        var protocol = window.location.protocol;
        var slashes = protocol.concat("//");
        var host = slashes.concat(window.location.host);

        this.state = {
            value: `${host}/leitura/${this.props.match.params.id}`,
            size: 200,
            fgColor: '#000000',
            bgColor: '#ffffff',
            level: 'L',
            renderAs: 'canvas',
            includeMargin: true,
            includeImage: true,
            imageH: 24,
            imageW: 24,
            imageX: 0,
            imageY: 0,
            imageSrc: '',
            imageExcavate: true,
            centerImage: true,
        }

    }

    toDownload(e) {
        let img = document.getElementById('image').toDataURL('image/png')
        let link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = img;
        link.click()
    }


    render() {
        return (
            <div className="d-flex align-items-center min-vh-100">
                <AdminHelmet title={"Geração de QR Code"} />
                <div className="container text-center">
                    <h1> Toque na Imagem P/ Download
                        <QRCode
                            id="image"
                            value={this.state.value}
                            size={this.state.size}
                            fgColor={this.state.fgColor}
                            bgColor={this.state.bgColor}
                            level={this.state.level}
                            renderAs={this.state.renderAs}
                            includeMargin={this.state.includeMargin}
                            imageSettings={
                                this.state.includeImage
                                    ? {
                                        src: this.state.imageSrc,
                                        height: this.state.imageH,
                                        width: this.state.imageW,
                                        x: this.state.centerImage ? null : this.state.imageX,
                                        y: this.state.centerImage ? null : this.state.imageY,
                                        excavate: this.state.imageExcavate,
                                    }
                                    : null
                            }
                            onClick={(e) => this.toDownload()}
                        />
                    </h1>
                </div>
            </div >
        );
    }
}
