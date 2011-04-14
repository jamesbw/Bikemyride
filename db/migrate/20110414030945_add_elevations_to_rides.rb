class AddElevationsToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :elevations, :text
  end

  def self.down
    remove_column :rides, :elevations
  end
end
