import React from "react";
import "./RecruitingAdvert.css";

const DISMISSED_KEY = "recruitingAdvertDismissed";

class RecruitingAdvert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissed: localStorage.getItem(DISMISSED_KEY) === "true",
    };
  }

  dismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    this.setState({ dismissed: true });
  }

  render() {
    if (this.state.dismissed) return null;

    return (
      <div id="recruiting-advert">
        <span>
          Want to improve this site? We&rsquo;re looking for student developers &mdash;{" "}
          <a href="mailto:contact@burntoutatbrown.com">get involved &rarr;</a>
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
