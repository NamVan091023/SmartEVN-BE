const Pollutions = {
    air: "Không khí",
    water: "Nước",
    land: "Đất",
    sound: "Tiếng ồn"
  };
  const PollutionQuality = {
    dangerous : 1,
    very_bad: 2,
    bad: 3,
    low_quality: 4,
    medium_quality: 5,
    good_quality: 6
  }
  const pollutions = Object.keys(Pollutions);
  const pollutionsQuality = Object.keys(PollutionQuality);
  const getQuality = (score) => {
    if(score == null) return null;
    if(score <= PollutionQuality.dangerous) return 'dangerous';
    if(score <= PollutionQuality.very_bad) return 'very_bad';
    if(score <= PollutionQuality.bad) return 'bad';
    if(score <= PollutionQuality.low_quality) return 'low_quality';
    if(score <= PollutionQuality.medium_quality) return 'medium_quality';
    return 'good_quality';
  }
  const getQualityName = (score) => {
    if(score == null) return null;
    if(score <= PollutionQuality.dangerous) return 'Nguy hại';
    if(score <= PollutionQuality.very_bad) return 'Rất xấu';
    if(score <= PollutionQuality.bad) return 'Xấu';
    if(score <= PollutionQuality.low_quality) return 'Kém';
    if(score <= PollutionQuality.medium_quality) return 'Trung bình';
    return 'Tốt';
  }
  module.exports = {
    getQuality,
    Pollutions,
    PollutionQuality,
    pollutions,
    pollutionsQuality,
    getQualityName
  };
  