class AddTotalDistanceToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :total_distance, :float
  end

  def self.down
    remove_column :rides, :total_distance
  end
end
