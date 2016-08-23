const React = require("react");
const ImageGallery = require("react-image-gallery").default;
const imageSpinnerConfig = require("./../../../config-values/imageSpinner");

module.exports = React.createClass({
	displayName: "ImageSpinner",

	render () {
		return (
			<ImageGallery items={imageSpinnerConfig.images} slideInterval={imageSpinnerConfig.interval} showThumbnails={false} showBullets={true} autoPlay={true} />
		);
	}
});