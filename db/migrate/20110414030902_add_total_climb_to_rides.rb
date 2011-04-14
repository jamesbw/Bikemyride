class AddTotalClimbToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :total_climb, :integer
  end

  def self.down
    remove_column :rides, :total_climb
  end
end
