import React, {
  useState, useEffect, useRef, useCallback
} from 'react';
import '../styles/styles.less';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import scrollIntoView from 'scroll-into-view';

import Header from './components/Header.jsx';
import DwChartContainer from './components/DwChartContainer.jsx';
import ChapterHeader from './components/ChapterHeader.jsx';
import ParallaxImage from './components/ParallaxImage.jsx';
import ScrollingText from './components/ScrollingText.jsx';

function App() {
  const appRef = useRef();
  const overviewRef = useRef();
  const chaptersContainerRef = useRef();
  const chapter1Ref = useRef();
  const chapter2Ref = useRef();
  const chapter3Ref = useRef();
  const chapter4Ref = useRef();
  const chapter5Ref = useRef();

  const [offset, setOffset] = useState(false);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const windowHeight = 0;
    setSectionProgress((offset > chaptersContainerRef.current.offsetTop - windowHeight) ? (Math.min(((offset - (chaptersContainerRef.current.offsetTop - windowHeight)) / chaptersContainerRef.current.offsetHeight) * 100, 100)) : 0);
  }, [offset]);

  const analytics = window.gtag || undefined;
  const track = useCallback((label_event = false, value_event = false) => {
    if (typeof analytics !== 'undefined' && label_event !== false && value_event !== false) {
      analytics('event', 'project_interaction', {
        label: label_event,
        project_name: '2025-rmt_report',
        transport_type: 'beacon',
        value: value_event
      });
    }
  }, [analytics]);

  const seenChapter = useCallback((chapter) => {
    track('Scroll', chapter);
  }, [track]);

  const isVisibleChapterOverview = useIsVisible(overviewRef);

  useEffect(() => {
    const paragraphs = appRef.current.querySelectorAll('.text_content p, .text_content ul, .text_content ol, .text_content h3, .text_content blockquote');

    // Options for the observer (when the p tag is 50% in the viewport)
    const options = {
      threshold: 0.5, // Trigger when 50% of the paragraph is visible
    };

    // Callback function for when the intersection occurs
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
        // Add the visible class when the element is in view
          entry.target.classList.add('visible');
        }
      });
    };

    // Create an IntersectionObserver instance with the callback and options
    const observer = new IntersectionObserver(observerCallback, options);

    // Observe each paragraph
    paragraphs.forEach(p => observer.observe(p));
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 500); // A short delay ensures the DOM is ready
  }, []);

  const chapterTitles = ['International maritime trade', 'World shipping fleet and service', 'Freight rates and maritime transport costs', 'Port performance and maritime trade facilitation', 'Legal issues and regulatory developments', 'The way forward'];

  const downloadDocument = (event) => {
    track('Anchor', `${event.currentTarget.href}`);
    event.stopPropagation();
  };

  const scrollTo = useCallback((target, name) => {
    track('Button', name);
    if (target.includes('anchor_')) {
      setTimeout(() => {
        scrollIntoView(document.querySelector(target), {
          align: {
            left: 0,
            leftOffset: 0,
            lockX: false,
            lockY: false,
            top: 0,
            topOffset: 40
          },
          cancellable: false,
          ease(value) {
            return value;
          },
          time: 1000
        });
      }, 50);
    } else {
      setTimeout(() => {
        scrollIntoView(appRef.current.querySelector(target), {
          align: {
            left: 0,
            leftOffset: 0,
            lockX: false,
            lockY: false,
            top: 0,
            topOffset: 60
          },
          cancellable: false,
          ease(value) {
            return value;
          },
          time: 1000
        });
      }, 50);
    }
  }, [track]);

  useEffect(() => {
    if (!overviewRef.current.classList.contains('seen') && isVisibleChapterOverview) {
      overviewRef.current.classList.add('seen');
      seenChapter('Overview');
    }
  }, [overviewRef, seenChapter, isVisibleChapterOverview]);

  useEffect(() => {

  }, []);

  return (
    <div className="app" ref={appRef}>
      <Header downloadDocument={downloadDocument} scrollTo={scrollTo} chapterTitles={chapterTitles} />
      { /* Overview */}
      <div className="content_container" ref={overviewRef}>
        <div className="text_container">
          <div className="text_content">
            <h3>Maritime transport and trade face daunting challenges. Ships that once passed through the Red Sea in days now sail for weeks around the Cape of Good Hope. Freight rates are high and volatile. Port disruption is becoming chronic. Supply chain reliability and resilience are being put to the test.</h3>
            <p>Longer routes have increased delays, costs and emissions, with developing countries hit hard by the disruptions and uncertainty.</p>
            <p>Deep transitions are also reshaping the sector. Technological, environmental and geoeconomic shifts are converging at a speed that requires rethinking how maritime transport operates. Alternative fuel vessels now represent over half of the ship tonnage of new orders, yet over 90% of the active fleet still runs on conventional fuels. Automation and digitalization promise efficiency but also heighten cyber risks.</p>
            <p>Maritime transport has weathered storms before. But never have so many transitions converged so quickly. The sector will adapt. The question is whether adaptation will be managed or chaotic, inclusive or divisive, sustainable or merely survivable.</p>
            <p>The Review of Maritime Transport 2025 provides the framework needed for informed action and sound policymaking to keep trade flowing in a turbulent world.</p>
            <blockquote>
              <div className="quote">The transitions ahead – to zero carbon, to digital systems, to new trade routes – must be just transitions. They must empower, not exclude. Build resilience, not deepen vulnerability.</div>
              <div className="author">
                <span className="name">Rebeca Grynspan</span>
                <span className="title">Secretary-General of UN Trade and Development (UNCTAD)</span>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="chapters_container" ref={chaptersContainerRef}>
        <div className="progress_indicator_container">
          <div className="section">
            <div className="progress_bar" style={{ width: `${sectionProgress}%` }} />
          </div>
        </div>
        <div className="backtotop_container">
          <div>
            <button type="button" onClick={() => scrollTo('.header_container', 'Top')}>Back to top</button>
          </div>
        </div>
        <ScrollingText texts={['How are maritime shipping and trade patterns changing?']} chapter_text="Chapter 1" />
        <div className="content_container chapter_header_1" ref={chapter1Ref}>
          <div className="text_container">
            <ChapterHeader
              chapter_number="1"
              subtitle="Global seaborne trade is under pressure. After a modest 2.2% growth in 2024, maritime trade is set to slow to 0.5% in 2025, before averaging 2% annually over the 2026–2030 period."
              title={chapterTitles[0]}
            />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/rmt2025ch1_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="chapter_download" aria-label="Download Chapter 1" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025rmt-chapter1.jpg" /></div></div>

            <div className="text_content">
              <p>Vessel rerouting has pushed up distances, causing ton-miles to jump 5.9% in 2024, nearly three times the growth in volume.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer title="Seaborne trade growth" chart_id="iJGvP" />
            </div>
            <div className="text_content">
              <p>Maritime energy trade patterns are also shifting. Coal rose despite a longer-term decline, oil stayed flat but took longer routes and gas increased. Demand, geopolitics and diversification strategies are reshaping energy flows, shipping distances and the geography of energy trade.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer title="Seaborne trade by energy commodity" chart_id="yE167" />
            </div>
            <div className="text_content">
              <p>Critical minerals trade is expanding, creating opportunities but also risks. These developments are reshaping maritime trade and putting new demands on transport and logistics.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer title="World maritime trade of selected critical minerals" chart_id="8AhiY" />
            </div>
          </div>
        </div>
        <ScrollingText texts={['Will the fleet of the future be ready for decarbonized shipping?']} chapter_text="Chapter 2" />
        <div className="content_container chapter_header_2" ref={chapter2Ref}>
          <div className="text_container">
            <ChapterHeader
              chapter_number="2"
              subtitle="By May 2025, tonnage through the Suez Canal was still 70% below 2023 levels. The Strait of Hormuz, through which 11% of global trade and a third of seaborne oil trade flow, also faces disruption risks. Rerouting onto longer routes increased carbon emissions from shipping in 2024."
              title={chapterTitles[1]}
            />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/rmt2025ch2_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="chapter_download" aria-label="Download Chapter 2" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025rmt-chapter2.jpg" /></div></div>
            <div className="charts_container">
              <DwChartContainer chart_id="wuNd6" title="Monthly ship transits through the Strait of Hormuz and the Suez Canal" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="TG4wP" title="Monthly annualized carbon dioxide emissions for all vessel types" />
            </div>
            <div className="text_content">
              <p>New trade tariffs in the United States and elsewhere have added complexity. For developing economies, shifting routes could generate transshipment opportunities for some ports, but could also increase shipping costs.</p>
              <p>By January 2025, the world fleet counted 112,500 vessels with 2.44 billion dead weight tons. Greece, China and Japan control over 40% of capacity, while nearly 50% of capacity is registered in just three flag states – Liberia, Panama and the Marshall Islands.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="W2Aw4" title="Top 10 leading flags of registration countries" />
              <DwChartContainer chart_id="Coge8" title="Top 10 leading flags of ship owning countries" />
            </div>
            <div className="text_content">
              <p>Fleet renewal, safe ship recycling, global rules on greenhouse gas emissions control and skilled labour are key for a timely and just transition to low-carbon shipping.</p>
            </div>
          </div>
        </div>
        <ScrollingText texts={['How are shipping costs reacting to disruption and regulatory compliance?']} chapter_text="Chapter 3" />
        <div className="content_container chapter_header_3" ref={chapter3Ref}>
          <div className="text_container">
            <ChapterHeader
              chapter_number="3"
              subtitle="Freight rate volatility has become the new normal. Container, bulk and tanker freight rates have remained elevated and volatile in 2024 and 2025, swinging sharply amid geopolitical tensions, trade policy shifts and supply–demand imbalances. This instability is driving up global trade costs."
              title={chapterTitles[2]}
            />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/rmt2025ch3_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="chapter_download" aria-label="Download Chapter 3" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025rmt-chapter3.jpg" /></div></div>
            <div className="text_content">
              <p>Rerouting ships has lengthened voyages, cut effective capacity and raised operating costs. Container shipping was hit hard with spot and charter rates nearing COVID-19 peaks by mid-2024 before easing, but still far above pre-crisis levels. Volatility has continued in 2025, amid new tariffs and the risk of disruptions in the Strait of Hormuz.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="66WBL" title="Shanghai Containerized Freight Index spot rates" />
            </div>
            <div className="text_content">
              <p>Dry bulk freight rates surged in 2024 on the back of strong coal, grain and fertilizer demand, Red Sea rerouting and limited fleet growth, before softening in 2025. Tanker markets, reflecting their sensitivity to geopolitical factors, were marked by volatility, with rates spiking in June 2025.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="mFsrv" title="The Baltic Dirty Tanker Index and Baltic Clean Tanker Index" />
            </div>
            <div className="text_content">
              <p>Environmental compliance expenditures add another layer to shipping costs. European Union emissions pricing is starting to affect transport costs, fleet choices and competitiveness across ship segments.</p>
            </div>
          </div>
        </div>
        <ScrollingText texts={['How do port performance and digital trade facilitation tools intersect?']} chapter_text="Chapter 4" />
        <div className="content_container chapter_header_4" ref={chapter4Ref}>
          <div className="text_container">
            <ChapterHeader
              chapter_number="4"
              subtitle="Ports are under increased strain as ship rerouting and port call reshuffling disrupt schedules. Between December 2023 and March 2024, average port waiting times climbed 23% to 6.4 hours in developed economies and 7% to 10.9 hours in developing ones."
              title={chapterTitles[3]}
            />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/rmt2025ch4_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="chapter_download" aria-label="Download Chapter 4" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025rmt-chapter4.jpg" /></div></div>
            <div className="charts_container">
              <DwChartContainer chart_id="9nVSh" title="Average waiting times for container ships in port" />
            </div>
            <div className="text_content">
              <p>Improving port performance is increasingly urgent, as is adapting port infrastructure and services to the impacts of climate change and upgrading them for the energy transition. By 2024, about 200 ports were offering LNG bunkering services and more on the way.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="Sk6d3" title="Ports providing liquefied natural gas (LNG) bunkering services" />
            </div>
            <div className="text_content">
              <p>Countries’ maritime connectivity patterns are also shifting. UNCTAD’s Liner Shipping Connectivity Index shows that while Asia retained its lead, Africa posted a 10% improvement between June 2024 and June 2025.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="owlos" title="Average Liner Shipping Connectivity Index value by region" />
            </div>
            <div className="text_content">
              <p>Ports are not just infrastructure and services – they’re powered by people. Yet diversity remains limited. Technology could open doors if matched with inclusive training.</p>
              <p>Digital trade facilitation tools boost performance in ports and other links in the transport chain. Trade single windows, maritime single windows and port community platforms help reduce inefficiencies and costs. Countries with such tools show stronger shipping connectivity and logistics performance.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="6gdgt" title="Correlation between connectivity and digital trade facilitation tools" />
            </div>
          </div>
        </div>
        <ScrollingText texts={['Are international legal frameworks keeping pace with new challenges and opportunities?']} chapter_text="Chapter 5" />
        <div className="content_container chapter_header_5" ref={chapter5Ref}>
          <div className="text_container">
            <ChapterHeader
              chapter_number="5"
              subtitle="Global shipping is moving closer to global climate rules. In October, the IMO will consider the formal adoption of its Net-Zero Framework. This would set the course toward net-zero by 2050 by introducing a global fuel standard and carbon pricing mechanism for international shipping."
              title={chapterTitles[4]}
            />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/rmt2025ch5_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="chapter_download" aria-label="Download Chapter 4" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025rmt-chapter5.jpg" /></div></div>
            <div className="text_content">
              <p>Revenues generated by the framework, if adopted, could help fund a just transition, including in small island developing states and least developed countries. But with significant investment needed to renew fleets, scale up alternative fuels and upgrade ports, mobilizing private finance will also be crucial.</p>
              <p>Alternative fuels can cut emissions, but their use and carriage raise new safety and environmental risks that require attention. Adequate safety protocols and appropriate global rules on liability and compensation are needed. The IMO is beginning to review whether existing international liability regimes are adequate. This process provides vulnerable developing countries an opportunity to make their voices heard.</p>
              <p>The world’s 1.9 million seafarers – most from developing countries – remain under strain. While recent amendments to the Maritime Labour Convention are encouraging, seafarer rights need more consistent implementation and enforcement, involving concerted action from flag states, port states and industry.</p>
              <p>The Hong Kong Convention on ship recycling entered into force in June 2025, setting new global standards on safety and environmental sustainability. Its widespread ratification will be key to maximizing its impact.</p>
              <p>The IMO is drafting a code for the safe, secure and environmentally sound operation of autonomous ships, to be finalized in 2026. It is also developing guidance or best practices on ship registration. All countries and industry stakeholders should engage in this important work.</p>

            </div>
          </div>
        </div>
        <ScrollingText texts={['What will it take to chart the right course?']} chapter_text="The way forward" />
        <div className="content_container chapter_header_6" ref={chapter5Ref}>
          <div className="text_container">
            <ChapterHeader
              chapter_number="6"
              subtitle="Maritime transport stands at a pivotal juncture. It must transition to a sustainable, resilient and digitally enabled future while navigating an increasingly unpredictable operational landscape."
              title="10 actions for a sustainable and resilient maritime transport"
            />
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025rmt-chapter6.jpg" /></div></div>
            <div className="text_content">
              <p>Priority actions for maritime transport stakeholders and governments, supported by UNCTAD, other international organizations and development partners, include the following:</p>
              <ol>
                <li>Leverage maritime transport and logistics for equitable integration and transformation.</li>
                <li>Plan and prepare for disruptions and uncertainty.</li>
                <li>Promote fleet modernization and sustainable maritime business practices.</li>
                <li>Protect and empower the maritime workforce and promote inclusiveness and upskilling.</li>
                <li>Implement regulatory measures to reduce greenhouse gas emissions from international shipping, accelerate decarbonization and facilitate a just and fair energy transition.</li>
                <li>Prepare for the safe handling, use and carriage of alternative fuels.</li>
                <li>Leverage digital solutions and strengthen the regulatory framework to address cyber-risks. </li>
                <li>Monitor port performance and leverage trade facilitation measures and tools. </li>
                <li>Enhance capacity-building and support developing countries.</li>
                <li>Strengthen and promote targeted collaboration on regulatory issues to address new challenges and foster sustainable and resilient maritime transport.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
