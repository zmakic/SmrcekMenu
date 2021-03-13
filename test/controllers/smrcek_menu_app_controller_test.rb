require 'test_helper'

class SmrcekMenuAppControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get smrcek_menu_app_index_url
    assert_response :success
  end

end
