import React from "react";
import "./RecruitingAdvert.css";


class RecruitingAdvert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div id="recruiting-advert">
        <span>
          Want to help improve Burnt Out @ Brown? We&rsquo;re looking for more developers &mdash;{" "}
          <a href="https://forms.gle/55zTFajTZMWYKf7n9" target="_blank" rel="noopener noreferrer">
            get involved! &rarr;
          </a> 
        </span>
      </div>
    );
  }
}

export default RecruitingAdvert;
