import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import './index.css'
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import Header from '../Header'
import EachJobItemDetails from '../EachJobItemDetails'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiconstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  onprogress: 'ONPROGRESS',
}

class Jobs extends Component {
  state = {
    profile: [],
    apistatus: apiconstants.onprogress,
    jobDetailsData: [],
    searchInput: '',
    radioinput: '',
    checkboxinput: [],
  }

  componentDidMount() {
    this.getprofile()
    this.getjobDetails()
  }

  getprofile = async () => {
    const response = await fetch('https://apis.ccbp.in/profile')
    const data = [await response.json()]
    const updatedData = data.map(each => ({
      name: each.profile_details.name,
      profileImageUrl: each.profile_details.profile_image_url,
      shortBio: each.profile_details.short_bio,
    }))
    this.setState({profile: updatedData})
  }

  getjobDetails = async () => {
    const {radioinput, checkboxinput, searchInput} = this.state
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxinput}&minimum_package=${radioinput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const fetchedData = data.jobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
      id: each.id,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))
    this.setState({
      jobDetailsData: fetchedData,
      apistatus: apiconstants.success,
    })
  }

  getRadioOption = event => {
    this.setState({radioinput: event.target.id}, this.getjobDetails)
  }

  getinputCheckboxOption = event => {
    const {checkboxinput} = this.state
    const inputnotinlist = checkboxinput.filter(each => each === each.target.id)
    if (inputnotinlist.length === 0) {
      this.setState(
        prevState => ({
          checkboxinput: [...prevState.checkboxinput, event.target.id],
        }),
        this.getjobDetails,
      )
    } else {
      const filteredData = checkboxinput.filter(
        each => each !== event.target.id,
      )
      this.setState({checkboxinput: filteredData}, this.getjobDetails)
    }
  }

  onretryjobs = () => {
    this.getjobDetails()
  }

  renderSuccessview = () => {
    const {jobDetailsData} = this.state
    const noJobs = jobDetailsData.length === 0
    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs.Try other filters</p>
      </div>
    ) : (
      <ul>
        {jobDetailsData.map(each => (
          <EachJobItemDetails jobdata={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderFailureview = () => (
    <div className="failbg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="faillogo"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retrybtn" onClick={this.onretryjobs}>
        Retry
      </button>
    </div>
  )

  renderOnProgressview = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderconstantsDiv = () => {
    const {apistatus} = this.state
    switch (apistatus) {
      case apiconstants.success:
        return this.renderSuccessview()
      case apiconstants.failure:
        return this.renderFailureview()
      case apiconstants.onprogress:
        return this.renderOnProgressview()
      default:
        return null
    }
  }

  ongetsearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEntersearchInput = event => {
    if (event.key === 'Enter') {
      this.getjobDetails()
    }
  }

  onsubmitsearchinput = () => {
    this.getjobDetails()
  }

  render() {
    const {profile} = this.state
    return (
      <div>
        <Header />
        <div className="bg">
          <div className="leftbg">
            <div>
              <img src={profile.profileImageUrl} alt="profile" />
              <h1>{profile.name}</h1>
              <p>{profile.shortBio}</p>
            </div>
            <hr />
            <div>
              <h1>Types of Employment</h1>
              <ul className="lists">
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId}>
                    <input
                      id={each.employmentTypeId}
                      type="checkbox"
                      onChange={this.getinputCheckboxOption}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1>Salary Range</h1>
              <ul className="lists">
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId}>
                    <input
                      type="radio"
                      name="option"
                      onChange={this.getRadioOption}
                      id={each.salaryRangeId}
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rightbg">
            <input
              type="search"
              onChange={this.ongetsearchInput}
              onKeyDown={this.onEntersearchInput}
            />

            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onsubmitsearchinput}
            >
              <AiOutlineSearch />
            </button>

            {this.renderconstantsDiv()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
