import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function About() {
    const [showMore, setShowMore] = useState(false);
    return (
        <>
            <Head>
                <title>Hotel Website | About</title>
                <link href="/css/style.css" rel="stylesheet" type="text/css" media="all" />
                <link href='http://fonts.googleapis.com/css?family=PT+Sans+Narrow' rel='stylesheet' type='text/css' />
            </Head>

            <div className="wrap">
                {/* Header */}
                <div className="header">
                    <div className="wrap">
                        <div className="header-top">
                            <div className="logo">
                                <Link href="/"><img src="/images/logo2.png" title="logo" alt="Logo" /></Link>
                            </div>
                            <div className="contact-info">
                                <p className="phone">Call us : <a href="#">980XXXXXXXX</a></p>
                                <p className="gpa">Gpa : <a href="#">View map</a></p>
                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                    <div className="header-top-nav">
                        <div className="wrap">
                            <ul>
                                <li><Link href="/">Home</Link></li>
                                <li className="active"><Link href="/about">About</Link></li>
                                <li><Link href="/services">Services</Link></li>
                                <li><Link href="/gallery">Gallery</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                                <div className="clear"></div>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="clear"></div>

                {/* Content */}
                <div className="content">
                    <div className="wrap">
                        <div className="about">
                            <div className="about-grids">
                                <div className="about-grid">
                                    <h3>About Our Hotel</h3>
                                    <a href="#"><img src="/images/slider1.jpg" title="about" alt="" /></a>
                                    <span>"Description about your hotel"</span>
                                    <p>Feel like home.</p>
                                    <a className="button1" href="#">Read More</a>
                                </div>
                                <div className="about-grid center-grid1">
                                    <h3>WHY CHOOSE US?</h3>
                                    <p>Your Description Here</p>
                                    <label>Label Heading</label>
                                    <p>Your Description</p>
                                    <label>Label heading</label>
                                    <p>Your Description</p>
                                </div>
                                <div className="about-grid last-grid">
                                    <h3>Our Hotel's Staff Info.</h3>
                                    <div className="about-team">
                                        <div className="client">
                                            <div className="about-team-left">
                                                <a href="#"><img src="/images/c1.jpg" title="client-name" alt="" /></a>
                                            </div>
                                            <div className="about-team-right">
                                                <p>Staff's Description</p>
                                            </div>
                                            <div className="clear"></div>
                                        </div>
                                        <div className="client">
                                            <div className="about-team-left">
                                                <a href="#"><img src="/images/c2.jpg" title="client-name" alt="" /></a>
                                            </div>
                                            <div className="about-team-right">
                                                <p>Staff's Description</p>
                                            </div>
                                            <div className="clear"></div>
                                        </div>
                                        <div className="client">
                                            <div className="about-team-left">
                                                <a href="#"><img src="/images/c1.jpg" title="client-name" alt="" /></a>
                                            </div>
                                            <div className="about-team-right">
                                                <p>Staff's Description</p>
                                            </div>
                                            <div className="clear"></div>
                                        </div>
                                        <div className="client">
                                            <div className="about-team-left">
                                                <a href="#"><img src="/images/c2.jpg" title="client-name" alt="" /></a>
                                            </div>
                                            <div className="about-team-right">
                                                <p>Staff's Description</p>
                                            </div>
                                            <div className="clear"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="clear"></div>
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>

                    {/* Boxes */}
                </div>

            </div>
        </>
    )
}
