import React, { useEffect, useState } from 'react'
import { apiService } from '../utils/apiService'
import BookingModal from '../components/BookingModal'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'

export default function GuestHome() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterGuests, setFilterGuests] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => { fetchRooms() }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiService.getRooms()
      setRooms(res.data.rooms || res.data || [])
    } catch (err) {
      console.error('Error loading rooms', err)
      setError(err.response?.data?.error || 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  const openBooking = (room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleBooked = () => {
    // simple refresh after booking
    fetchRooms()
  }

  const available = (r) => {
    if (!r) return false
    const okCapacity = (r.capacity || r.max_guests || 1) >= filterGuests
    const statusOk = !r.status || r.status.toLowerCase() === 'available' || r.available === true
    return okCapacity && statusOk
  }

  return (
    <>
      <Head>
        <title>Hotel Website | Home</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css" media="all" />
        <link href='http://fonts.googleapis.com/css?family=PT+Sans+Narrow' rel='stylesheet' type='text/css' />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <script src="/js/responsiveslides.min.js"></script>
        <script>
          {`
            $(function () {
              $("#slider1").responsiveSlides({
                maxwidth: 1600,
                speed: 600
              });
            });
          `}
        </script>
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
                <p className="phone">Call us : <a href="#">980XXXXXXX</a></p>
                <p className="gpa">Gpa : <a href="#">View map</a></p>
                <p className="code">BROUGHT TO YOU BY:<a href="https://www.code-projects.org">CODE-PROJECTS</a></p>
              </div>
              <div className="clear"></div>
            </div>
          </div>
          <div className="header-top-nav">
            <div className="wrap">
              <ul>
                <li className="active"><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <div className="clear"></div>
              </ul>
            </div>
          </div>
        </div>
        <div className="clear"></div>

        {/* Image Slider */}
        <div className="image-slider">
          <ul className="rslides" id="slider1">
            <li><img src="/images/slider3.jpg" alt="" /></li>
            <li><img src="/images/slider1.jpg" alt="" /></li>
            <li><img src="/images/slider3.jpg" alt="" /></li>
          </ul>
        </div>

        {/* Content */}
        <div className="content">
          <div className="quit">
            <p><span className="start">Your </span> hotel's <span className="end">Motto .</span></p>
          </div>
          <div className="content-grids">
            <div className="wrap">
              <div className="content-grid">
                <div className="content-grid-pic">
                  <a href="#"><img src="/images/icon1.png" title="image-name" alt="" /></a>
                </div>
                <div className="content-grid-info">
                  <h3>Best food Ever</h3>
                  <p>"DESCRIPTION"</p>
                  <a href="#">Read More</a>
                </div>
                <div className="clear"></div>
              </div>
              <div className="content-grid">
                <div className="content-grid-pic">
                  <a href="#"><img src="/images/icon2.png" title="image-name" alt="" /></a>
                </div>
                <div className="content-grid-info">
                  <h3>24x7 phone support</h3>
                  <p>"DESCRIPTION"</p>
                  <a href="#">Read More</a>
                </div>
                <div className="clear"></div>
              </div>
              <div className="content-grid">
                <div className="content-grid-pic">
                  <a href="#"><img src="/images/iocn3.png" title="image-name" alt="" /></a>
                </div>
                <div className="content-grid-info">
                  <h3>Best Room Services</h3>
                  <p>"DESCRIPTION"</p>
                  <a href="#">Read More</a>
                </div>
                <div className="clear"></div>
              </div>
              <div className="clear"></div>
            </div>
          </div>
          <div className="clear"></div>

          {/* Content Box */}
          <div className="content-box">
            <div className="wrap">
              <div className="content-box-left">
                <div className="content-box-left-topgrid">
                  <h3>welcome to our Hotel</h3>
                  <p>' Feel Like Home :)</p>
                  <p>Hotel's Description</p>
                  <span>For more information about our Hotel, Call 980XXXXXXX</span>
                </div>
                <div className="content-box-left-bootomgrids">
                  <div className="content-box-left-bootomgrid">
                    <h3>Deluxe Rooms</h3>
                    <p>Your description about deluxe rooms</p>
                    <a href="#"><img src="/images/slider1.jpg" title="image-name" alt="" /></a>
                  </div>
                  <div className="content-box-left-bootomgrid">
                    <h3>Luxury Rooms</h3>
                    <p>Your description about Luxury rooms</p>
                    <a href="#"><img src="/images/slider2.jpg" title="image-name" alt="" /></a>
                  </div>
                  <div className="content-box-left-bootomgrid lastgrid">
                    <h3>Executive Rooms</h3>
                    <p>Your description about Executive rooms</p>
                    <a href="#"><img src="/images/slider3.jpg" title="image-name" alt="" /></a>
                  </div>
                  <div className="clear"></div>
                </div>
                <div className="clear"></div>
              </div>
              <div className="content-box-right">
                <div className="content-box-right-topgrid">
                  <h3>To days Specials</h3>
                  <a href="#"><img src="/images/slider1.jpg" title="imnage-name" alt="" /></a>
                  <h4>Super Discount Offer</h4>
                  <p>"DESCRIPTION"</p>
                  <a href="#">Read More</a>
                </div>
                <div className="content-box-right-bottomgrid"></div>
              </div>
              <div className="clear"></div>
            </div>
            <div className="clear"></div>
          </div>

          {/* Boxes */}
          <div className="boxs">
            <div className="wrap">
              <div className="box"></div>
              <div className="box center-box">
                <ul>
                  <li><a href="https://www.code-projects.org">Leave a Feedback</a></li>
                  <li><a href="https://www.code-projects.org">Reviews and Ratings</a></li>
                  <li><a href="https://www.code-projects.org">FAQs</a></li>
                  <li><a href="https://www.code-projects.org">Packages</a></li>
                  <li><a href="https://www.code-projects.org">Know about Moutaineering and trekking here</a></li>
                  <li><a href="https://www.code-projects.org">www.code-projects.org</a></li>
                </ul>
              </div>
              <div className="clear"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="copy-tight">
          <p>&copy HOTEL,Nepal 2017 "THIS PROJECT IS BROUGHT TO YOU BY <a href="http://www.code-projects.org/">CODE-PROJECTS"</a></p>
        </div>
      </div>

      {/* Original React Content */}
      <main className={styles.container} style={{ padding: 20 }}>
        <header className={styles.header}>
          <h1>Guest Portal</h1>
          <p>Browse rooms, make bookings, and view your booking history.</p>
        </header>

        <section style={{ marginTop: 12, marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>Guests:
            <input type="number" min="1" value={filterGuests} onChange={e => setFilterGuests(Number(e.target.value || 1))} style={{ marginLeft: 8, width: 80 }} />
          </label>
          <button onClick={fetchRooms} style={{ marginLeft: 8 }}>Refresh</button>
        </section>

        {loading && <div>Loading rooms…</div>}
        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        <ul className={styles.roomsList}>
          {rooms.filter(available).map(room => (
            <li key={room.id || room._id} className={styles.roomItem}>
              <div>
                <strong>{room.room_type || room.name}</strong>
                <div style={{ marginTop: 6 }}>{room.description || room.notes || ''}</div>
                <div style={{ marginTop: 6 }}>${room.price || room.rate || '—'}/night • Capacity: {room.capacity || room.max_guests || 1}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openBooking(room)} style={{ background: '#0070f3', color: '#fff' }}>Book</button>
              </div>
            </li>
          ))}
        </ul>

        <BookingModal open={isModalOpen} room={selectedRoom} onClose={() => setIsModalOpen(false)} onBooked={handleBooked} />
      </main>
    </>
  )
}
