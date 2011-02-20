class Ride < ActiveRecord::Base
	attr_accessible :content

	belongs_to :user

	default_scope :order => 'rides.created_at DESC'

	validates :content, :presence => true
	validates :user_id, :presence => true

end
