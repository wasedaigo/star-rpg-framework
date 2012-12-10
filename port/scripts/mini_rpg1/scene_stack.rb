module MiniRPG1
  class SceneStack
    def initialize(init_scene)
      @stack = [init_scene]
    end

    def current
      @stack.last
    end

    def <<(new_scene)
      self.push(new_scene)
    end
    
    def push(new_scene)
      @stack << new_scene
    end

    def pop
      @stack.pop
    end

    def clear
      @stack.clear
    end

    def empty?
      return @stack.empty?
    end

  end
end
