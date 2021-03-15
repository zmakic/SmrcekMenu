class ApplicationController < ActionController::Base

  skip_before_action :verify_authenticity_token # TODO - this is here only until testing with postman done
end
