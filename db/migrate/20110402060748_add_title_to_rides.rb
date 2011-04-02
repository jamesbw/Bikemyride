class AddTitleToRides < ActiveRecord::Migration
  def self.up
    add_column :rides, :title, :string
  end

  def self.down
    remove_column :rides, :title
  end
end
