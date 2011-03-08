# == Schema Information
# Schema version: 20110307013029
#
# Table name: rides
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  created_at :datetime
#  updated_at :datetime
#  route      :text
#

class Ride < ActiveRecord::Base
	attr_accessible :route

	belongs_to :user

	default_scope :order => 'rides.created_at DESC'

	validates :route, :presence => true
	validates :user_id, :presence => true

end
