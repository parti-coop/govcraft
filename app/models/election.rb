class Election < ApplicationRecord
  SLUG_20180613 = '20180613'
  CANDIDATE_CATEGORY_20180613_PRECANDIDATE = 'precandidate'

  has_many :action_targets, as: :action_assignable
  has_many :election_candidates, dependent: :restrict_with_error, primary_key: :slug, foreign_key: :election_slug
  has_many :speakers, through: :election_candidates

  def statementable_speakers(statementable)
    if statementable.respond_to?(:area) and convert_area_code(statementable.area).present?
      speakers.where(id: election_candidates.where(area_division_code: convert_area_code(statementable.area)).select(:speaker_id))
    else
      speakers
    end
  end

  def statementable_speakers_moderatly(statementable, limit)
    result = statementable_speakers(statementable)
    if result.count > limit
      result.order("RAND()").first(limit)
    else
      result
    end
  end

  def speakers_moderatly(limit)
    if speakers.count > limit
      speakers.order("RAND()").first(limit)
    else
      speakers
    end
  end

  def self.of_slug(slug)
    find_by(slug: slug)
  end

  def section_title_as_action_assignable
    if slug == Election::SLUG_20180613
      '제7대 지방선거 예비후보에게 촉구하기'
    else
      "#{title} 관련 인물에게 촉구하기"
    end
  end

  def response_section_title_as_action_assignable
    if slug == Election::SLUG_20180613
      '제7대 지방선거 예비후보 응답'
    else
      "#{title} 관련 인물 응답"
    end
  end

  def speakers_unspoken_limit
    30
  end

  AREA_MAP = {"1100000"=>"1100", "2100000"=>"2600", "2200000"=>"2700", "2300000"=>"2800", "2400000"=>"2900", "2500000"=>"3000", "2600000"=>"3100", "2900000"=>"5100", "3100000"=>"4100", "3200000"=>"4200", "3300000"=>"4300", "3400000"=>"4400", "3500000"=>"4500", "3600000"=>"4600", "3700000"=>"4700", "3800000"=>"4800", "3900000"=>"4900"}
  def convert_area_code(area)
    AREA_MAP[area.try(:code)]
  end
end
