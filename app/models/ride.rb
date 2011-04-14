# == Schema Information
# Schema version: 20110414030945
#
# Table name: rides
#
#  id             :integer         not null, primary key
#  user_id        :integer
#  created_at     :datetime
#  updated_at     :datetime
#  route          :text
#  title          :string(255)
#  description    :text
#  max_grade      :integer
#  total_distance :float
#  total_climb    :integer
#  elevations     :text
#

class Ride < ActiveRecord::Base
	attr_accessible :route, :title, :max_grade, :description, :total_distance, :total_climb, :elevations

	belongs_to :user

	default_scope :order => 'rides.created_at DESC'

	validates :route, :presence => true
	validates :user_id, :presence => true
	validates :title, :presence => true, :length => { :maximum => 140 }
	validates :max_grade, :presence => true, :numericality => true,:inclusion => { :in => 0..100 }
	validates :total_distance, :presence => true, :numericality => true, :inclusion => { :in => 0..10000 }
	validates :total_climb, :presence => true, :numericality => true, :inclusion => { :in => 0..1000000 }
	validates :elevations, :presence => true

end
