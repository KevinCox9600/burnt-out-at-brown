import React from "react";
import "./RecruitingAdvert.css";


class RecruitingAdvert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissed: false,
    };
  }

  dismiss() {
    this.setState({ dismissed: true });
  }

  render() {
    if (this.state.dismissed) return null;

    return (
      <div id="recruiting-advert">
        <span>
          Want to help improve Burnt Out @ Brown? We&rsquo;re looking for more developers &mdash;{" "}
          <a href="https://forms.gle/55zTFajTZMWYKf7n9" target="_blank" rel="noopener noreferrer">
            get involved (Apply by March 31)&rarr;
          </a> 
        </span>
        <button
          id="recruiting-advert-dismiss"
          aria-label="Dismiss"
          onClick={() => this.dismiss()}
        >
          &times;
        </button>
      </div>
    );
  }
}

export default RecruitingAdvert;
