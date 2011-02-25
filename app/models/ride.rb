# == Schema Information
# Schema version: 20110218185711
#
# Table name: rides
#
#  id         :integer         not null, primary key
#  content    :string(255)
#  user_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class Ride < ActiveRecord::Base
	attr_accessible :content

	belongs_to :user

	default_scope :order => 'rides.created_at DESC'

	validates :content, :presence => true
	validates :user_id, :presence => true

end
