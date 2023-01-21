import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import getStatusStyle from 'Calendar/getStatusStyle';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import EpisodeDetailsModal from 'Episode/EpisodeDetailsModal';
import episodeEntities from 'Episode/episodeEntities';
import { icons, kinds } from 'Helpers/Props';
import padNumber from 'Utilities/Number/padNumber';
import CalendarEventQueueDetails from './CalendarEventQueueDetails';
import styles from './CalendarEvent.css';

class CalendarEvent extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDetailsModalOpen: false
    };
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isDetailsModalOpen: true }, () => {
      this.props.onEventModalOpenToggle(true);
    });
  };

  onDetailsModalClose = () => {
    this.setState({ isDetailsModalOpen: false }, () => {
      this.props.onEventModalOpenToggle(false);
    });
  };

  //
  // Render

  render() {
    const {
      id,
      series,
      episodeFile,
      title,
      seasonNumber,
      episodeNumber,
      airDateUtc,
      monitored,
      unverifiedSceneNumbering,
      hasFile,
      grabbed,
      queueItem,
      showEpisodeInformation,
      showFinaleIcon,
      showSpecialIcon,
      showCutoffUnmetIcon,
      fullColorEvents,
      colorImpairedMode
    } = this.props;

    if (!series) {
      return null;
    }

    const startTime = moment(airDateUtc);
    const endTime = moment(airDateUtc).add(series.runtime, 'minutes');
    const isDownloading = !!(queueItem || grabbed);
    const isMonitored = series.monitored && monitored;
    const statusStyle = getStatusStyle(hasFile, isDownloading, startTime, endTime, isMonitored);
    const season = series.seasons.find((s) => s.seasonNumber === seasonNumber);
    const seasonStatistics = season?.statistics || {};

    return (
      <div
        className={classNames(
          styles.event,
          styles[statusStyle],
          colorImpairedMode && 'colorImpaired',
          fullColorEvents && 'fullColor'
        )}
      >
        <Link
          className={styles.underlay}
          onPress={this.onPress}
        />

        <div className={styles.overlay} >
          <div className={styles.info}>
            <div className={styles.seriesTitle}>
              {series.title}
            </div>

            <div className={styles.statusContainer}>
              {
                unverifiedSceneNumbering ?
                  <Icon
                    className={styles.statusIcon}
                    name={icons.WARNING}
                    title="Scene number hasn't been verified yet"
                  /> :
                  null
              }

              {
                queueItem ?
                  <span className={styles.statusIcon}>
                    <CalendarEventQueueDetails
                      {...queueItem}
                    />
                  </span> :
                  null
              }

              {
                !queueItem && grabbed ?
                  <Icon
                    className={styles.statusIcon}
                    name={icons.DOWNLOADING}
                    title="Episode is downloading"
                  /> :
                  null
              }

              {
                showCutoffUnmetIcon &&
                !!episodeFile &&
                episodeFile.qualityCutoffNotMet ?
                  <Icon
                    className={styles.statusIcon}
                    name={icons.EPISODE_FILE}
                    kind={fullColorEvents ? kinds.DEFAULT : kinds.WARNING}
                    title="Quality cutoff has not been met"
                  /> :
                  null
              }

              {
                episodeNumber === 1 && seasonNumber > 0 ?
                  <Icon
                    className={styles.statusIcon}
                    name={icons.INFO}
                    kind={kinds.INFO}
                    darken={fullColorEvents}
                    title={seasonNumber === 1 ? 'Series premiere' : 'Season premiere'}
                  /> :
                  null
              }

              {
                showFinaleIcon &&
                episodeNumber !== 1 &&
                seasonNumber > 0 &&
                episodeNumber === seasonStatistics.totalEpisodeCount ?
                  <Icon
                    className={styles.statusIcon}
                    name={icons.INFO}
                    kind={fullColorEvents ? kinds.DEFAULT : kinds.WARNING}
                    title={series.status === 'ended' ? 'Series finale' : 'Season finale'}
                  /> :
                  null
              }

              {
                showSpecialIcon &&
                (episodeNumber === 0 || seasonNumber === 0) ?
                  <Icon
                    className={styles.statusIcon}
                    name={icons.INFO}
                    kind={kinds.PINK}
                    darken={fullColorEvents}
                    title="Special"
                  /> :
                  null
              }
            </div>
          </div>

          {
            showEpisodeInformation ?
              <div className={styles.episodeInfo}>
                <div className={styles.episodeTitle}>
                  {title}
                </div>

                <div>
                  {seasonNumber}x{padNumber(episodeNumber, 2)}
                </div>
              </div> :
              null
          }
        </div>

        <EpisodeDetailsModal
          isOpen={this.state.isDetailsModalOpen}
          episodeId={id}
          episodeEntity={episodeEntities.CALENDAR}
          seriesId={series.id}
          episodeTitle={title}
          showOpenSeriesButton={true}
          onModalClose={this.onDetailsModalClose}
        />
      </div>
    );
  }
}

CalendarEvent.propTypes = {
  id: PropTypes.number.isRequired,
  series: PropTypes.object.isRequired,
  episodeFile: PropTypes.object,
  title: PropTypes.string.isRequired,
  seasonNumber: PropTypes.number.isRequired,
  episodeNumber: PropTypes.number.isRequired,
  absoluteEpisodeNumber: PropTypes.number,
  airDateUtc: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  unverifiedSceneNumbering: PropTypes.bool,
  hasFile: PropTypes.bool.isRequired,
  grabbed: PropTypes.bool,
  queueItem: PropTypes.object,
  showEpisodeInformation: PropTypes.bool.isRequired,
  showFinaleIcon: PropTypes.bool.isRequired,
  showSpecialIcon: PropTypes.bool.isRequired,
  showCutoffUnmetIcon: PropTypes.bool.isRequired,
  fullColorEvents: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
  colorImpairedMode: PropTypes.bool.isRequired,
  onEventModalOpenToggle: PropTypes.func.isRequired
};

export default CalendarEvent;
