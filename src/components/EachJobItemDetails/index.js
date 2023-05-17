import {Link} from 'react-router-dom'

import './index.css'

const EachJobItemDetails = props => {
  const {jobdata} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobdata
  return (
    <Link to={`/jobs/${id}`}>
      <div className="jobbg">
        <div>
          <div className="logodiv">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="titlelogo"
            />
            <div>
              <h1 className="title">{title}</h1>

              <p className="title">{rating}</p>
            </div>
          </div>

          <div className="jobdetails">
            <p>{location}</p>
            <p>{employmentType}</p>
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="line" />
        <h1>Description</h1>
        <p className="title">{jobDescription}</p>
      </div>
    </Link>
  )
}

export default EachJobItemDetails
