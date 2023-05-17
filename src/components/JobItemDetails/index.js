import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Header from '../Header'
import {Loader} from 'react-loader-spinner'

const apiconstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {jobDetailsData: [], similarData: [], apistatus: apiconstants.loading}

  componentDidMount() {
    this.getjobitemData()
  }

  getjobitemData = async () => {
    const url = `https://apis.ccbp.in/jobs/:${id}`
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        location: each.location,
        packagePerAnnum: each.packae_per_annum,
        rating: each.rating,
        skills: each.skills.map(eachskill => ({
          imageUrl: eachskill.image_url,
          name: eachskill.name,
        })),
        title: each.title,
      }))

      const updatessimilardata = fetchedData.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        id: each.id,
        jobDescription: each.job_description,
        employmentType: each.employment_type,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDetailsData: updatedData,
        similarData: updatessimilardata,
        apistatus: apiconstants.success,
      })
    } else {
      this.setState({
        apistatus: apiconstants.failure,
      })
    }
  }

  rendersuccessView = () => {
    const {jobDetailsData, similarData} = this.state
    if (jobDetailsData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDetailsData[0]
      return (
        <div>
          <div>
            <div>
              <div>
                <img src={companyLogoUrl} alt="job details company logo" />
                <div>
                  <h1>{title}</h1>
                  <div>
                    <AiFillStar />
                    <p>{rating}</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div>
                    <MdLocationOn />
                    <p>{location}</p>
                  </div>
                  <div>
                    <p>{employmentType}</p>
                  </div>
                </div>
                <div>
                  <p>{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div>
                <h1>Description</h1>
                <a href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p>{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul>
              {skills.map(each => (
                <li key={each.name}>
                  <img src={each.imageUrl} alt={each.name} />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <div>
                <h1>Life at Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarData.map(each => (
              <SimilarJobs
                key={each.id}
                similarJobData={each}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  renderFailureView = () => {
    ;<div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img-png"
        alt="failure view"
      />
      <h1>Oops! Something went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <div>
        <button type="button" onClick={this.onretrybutton}>
          retry
        </button>
      </div>
    </div>
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderjobdetailsViews = () => {
    const {apistatus} = this.state

    switch (apistatus) {
      case apiconstants.success:
        return this.rendersuccessView()
      case apiconstants.failure:
        return this.renderFailureView()
      case apiconstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.renderjobdetailsViews()}</div>
      </div>
    )
  }
}

export default JobItemDetails
