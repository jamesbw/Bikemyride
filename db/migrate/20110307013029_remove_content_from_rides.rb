class RemoveContentFromRides < ActiveRecord::Migration
  def self.up
  	remove_column :rides, :content
  end

  def self.down
  	add_column :rides, :content, :string
  end
end
