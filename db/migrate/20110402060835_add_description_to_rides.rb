class AddDescriptionToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :description, :text
  end

  def self.down
    remove_column :rides, :description
  end
end
