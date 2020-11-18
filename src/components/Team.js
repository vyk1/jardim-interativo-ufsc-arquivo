import TeamData from 'data/TeamData'
import React from 'react'
import '../assets/academicons-1.9.0/css/academicons.min.css'

const Team = () => {
    return (
        <div className="wrapper">
            <div className="section">
                <div className="container">
                    <div className="col-12">
                        <section className="team-section text-center my-5">

                            <h3 className="h1-responsive font-weight-bold my-5">Nossa Equipe</h3>

                            <div className="row">

                                {
                                    TeamData.map((t, i) => (
                                        <div key={i} className="col-lg-4 col-md-6 mb-lg-0 mb-5">
                                            <div className="avatar mx-auto">
                                                <img src={t.img} className="rounded-circle z-depth-1"
                                                    alt={t.name} />
                                            </div>
                                            <h5 className="font-weight-regular mt-4 mb-3">{t.name}</h5>
                                            <p className="text-uppercase"><strong>{t.profession}</strong></p>
                                            <ul className="list-unstyled mb-0">
                                                {
                                                    t.lattes && (
                                                        <a href={t.lattes} target="_blank" rel="noopener noreferrer" className="p-2 fa-lg fb-ic">
                                                            <i className="ai ai-lattes" aria-hidden="true"></i>
                                                        </a>
                                                    )
                                                }
                                                {
                                                    t.facebook && (
                                                        <a href={t.lattes} target="_blank" rel="noopener noreferrer" className="p-2 fa-lg fb-ic">
                                                            <i className="fab fa-facebook-f" aria-hidden="true"></i>
                                                        </a>
                                                    )
                                                }
                                                {
                                                    t.instagram && (
                                                        <a href={t.lattes} target="_blank" rel="noopener noreferrer" className="p-2 fa-lg fb-ic">
                                                            <i className="fab fa-instagram" aria-hidden="true"></i>
                                                        </a>
                                                    )
                                                }
                                            </ul>
                                        </div>

                                    ))
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Team